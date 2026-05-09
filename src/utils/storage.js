import { mockDeliveryRequests, mockMotoboys } from '../data/mockData';
import { generateDeliveryProtocol } from './protocol';

const keys = {
  motoboys: 'mb_express_motoboys',
  requests: 'mb_express_delivery_requests',
  auth: 'mb_express_admin_auth',
};

function read(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    if (!value) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function write(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
  return value;
}

export function getMotoboys() {
  return read(keys.motoboys, mockMotoboys);
}

export function saveMotoboys(motoboys) {
  return write(keys.motoboys, motoboys);
}

export function addMotoboy(motoboy) {
  const motoboys = getMotoboys();
  const next = [{ ...motoboy, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...motoboys];
  saveMotoboys(next);
  return next[0];
}

export function updateMotoboy(id, patch) {
  const next = getMotoboys().map((motoboy) => (motoboy.id === id ? { ...motoboy, ...patch } : motoboy));
  saveMotoboys(next);
  return next;
}

export function deleteMotoboy(id) {
  const next = getMotoboys().filter((motoboy) => motoboy.id !== id);
  saveMotoboys(next);
  return next;
}

export function getDeliveryRequests() {
  const requests = read(keys.requests, mockDeliveryRequests);
  const needsMigration = requests.some((request) => !request.protocol);
  if (!needsMigration) return requests;

  const migrated = requests.map((request) => ({
    ...request,
    protocol: request.protocol || generateDeliveryProtocol(new Date(request.createdAt || Date.now())),
  }));
  saveDeliveryRequests(migrated);
  return migrated;
}

export function saveDeliveryRequests(requests) {
  return write(keys.requests, requests);
}

export function addDeliveryRequest(request) {
  const requests = getDeliveryRequests();
  const next = [
    {
      ...request,
      id: crypto.randomUUID(),
      protocol: request.protocol || generateDeliveryProtocol(),
      createdAt: new Date().toISOString(),
    },
    ...requests,
  ];
  saveDeliveryRequests(next);
  return next[0];
}

export function updateDeliveryRequest(id, patch) {
  const next = getDeliveryRequests().map((request) =>
    request.id === id ? { ...request, ...patch } : request,
  );
  saveDeliveryRequests(next);
  return next;
}

export function getAuthSession() {
  return read(keys.auth, null);
}

export function setAuthSession(session) {
  return write(keys.auth, session);
}

export function clearAuthSession() {
  localStorage.removeItem(keys.auth);
}
