import { pricingConfig } from '../data/config';
import { calculateGoogleRoute, geocodeWithGoogle, shouldUseGoogleMaps } from './googleMapsService';

const blumenauFallback = [
  {
    label: 'Rua XV de Novembro, Centro, Blumenau - SC',
    lat: -26.9195,
    lon: -49.0659,
  },
  {
    label: 'Rua 2 de Setembro, Itoupava Norte, Blumenau - SC',
    lat: -26.8878,
    lon: -49.0735,
  },
  {
    label: 'Rua Amazonas, Garcia, Blumenau - SC',
    lat: -26.9355,
    lon: -49.0653,
  },
  {
    label: 'Rua Bahia, Salto Weissbach, Blumenau - SC',
    lat: -26.9028,
    lon: -49.1079,
  },
  {
    label: 'Rua Doutor Pedro Zimmermann, Itoupava Central, Blumenau - SC',
    lat: -26.8218,
    lon: -49.0797,
  },
  {
    label: 'Rua Das Missões, Ponta Aguda, Blumenau - SC',
    lat: -26.9139,
    lon: -49.0588,
  },
  {
    label: 'Rua Dona Emma, Escola Agrícola, Blumenau - SC',
    lat: -26.8953,
    lon: -49.0954,
  },
  {
    label: 'Rua Divinopolis, Velha Central, Blumenau - SC',
    lat: -26.9188,
    lon: -49.1452,
  },
  {
    label: 'Rua Progresso, Progresso, Blumenau - SC',
    lat: -26.9694,
    lon: -49.0748,
  },
];

function normalizeAddress(item) {
  return {
    label: item.display_name,
    lat: Number(item.lat),
    lon: Number(item.lon),
    houseNumber: item.address?.house_number || '',
    source: 'nominatim',
  };
}

export async function searchAddresses(query) {
  if (!query || query.trim().length < 3) return [];
  const searchQuery = normalizeSearchQuery(query);
  const houseNumber = extractHouseNumber(query);
  const streetName = extractStreetName(query);
  const normalizedQuery = query
    .toLowerCase()
    .replace(/,\s*n[ºo]?\s*[\w/-]+/i, '')
    .replace(/\b\d+[a-z]?\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  const localMatches = blumenauFallback.filter((address) =>
    address.label.toLowerCase().includes(query.toLowerCase()) ||
    address.label.toLowerCase().includes(normalizedQuery),
  );

  try {
    const structured = houseNumber && streetName ? await nominatimSearch({
      street: `${houseNumber} ${streetName}`,
      city: 'Blumenau',
      state: 'Santa Catarina',
      country: 'Brasil',
    }) : [];
    const freeText = await nominatimSearch({
      q: `${searchQuery}, Blumenau, Santa Catarina, Brasil`,
    });
    const remote = rankAddresses([...structured, ...freeText], houseNumber);
    return [...remote, ...localMatches].slice(0, 6);
  } catch {
    return localMatches.length ? localMatches : blumenauFallback.slice(0, 5);
  }
}

export async function resolveBestAddress(address) {
  if (!address || address.trim().length < 3) return null;

  if (shouldUseGoogleMaps()) {
    const googleAddress = await geocodeWithGoogle(`${address}, Blumenau, Santa Catarina, Brasil`);
    if (googleAddress) return googleAddress;
  }

  const fallback = getFallbackAddress(address);
  if (fallback) return { ...fallback, label: address, source: 'fallback' };

  const results = await searchAddresses(address);
  return results[0] || null;
}

async function nominatimSearch(paramsObject) {
  const params = new URLSearchParams({
    ...paramsObject,
    format: 'json',
    addressdetails: '1',
    limit: '6',
    countrycodes: 'br',
    bounded: '1',
    viewbox: '-49.22,-26.76,-48.93,-27.08',
  });
  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`);
  if (!response.ok) throw new Error('Map provider unavailable');
  const data = await response.json();
  return data.map(normalizeAddress);
}

function rankAddresses(addresses, houseNumber) {
  const unique = new Map();
  addresses.forEach((address) => {
    const key = `${address.lat.toFixed(6)}-${address.lon.toFixed(6)}`;
    if (!unique.has(key)) unique.set(key, address);
  });
  return [...unique.values()].sort((a, b) => {
    const aExact = houseNumber && a.houseNumber === houseNumber ? 1 : 0;
    const bExact = houseNumber && b.houseNumber === houseNumber ? 1 : 0;
    return bExact - aExact;
  });
}

export async function calculateRoadRoute(origin, destination) {
  if (!origin || !destination) return null;

  try {
    if (shouldUseGoogleMaps()) {
      const googleRoute = await calculateGoogleRoute(origin, destination);
      if (googleRoute) return googleRoute;
    }

    const coords = `${origin.lon},${origin.lat};${destination.lon},${destination.lat}`;
    const params = new URLSearchParams({
      overview: 'full',
      geometries: 'geojson',
      steps: 'false',
      alternatives: 'false',
    });
    const response = await fetch(`https://router.project-osrm.org/route/v1/driving/${coords}?${params.toString()}`);
    if (!response.ok) throw new Error('Route provider unavailable');
    const data = await response.json();
    const route = data.routes?.[0];
    if (!route) return null;

    return {
      distanceKm: Number((route.distance / 1000).toFixed(1)),
      durationMinutes: Math.max(1, Math.ceil(route.duration / 60)),
      coordinates: route.geometry.coordinates.map(([lon, lat]) => [lat, lon]),
      provider: 'OSRM/OpenStreetMap',
    };
  } catch {
    return null;
  }
}

export function getFallbackAddress(label) {
  const exact = blumenauFallback.find((address) => address.label === label);
  if (exact) return exact;
  const partial = blumenauFallback.find((address) =>
    label?.toLowerCase().includes(address.label.split(',')[0].toLowerCase()),
  );
  return partial || null;
}

export function calculateDistanceKm(origin, destination) {
  if (!origin || !destination) return 0;
  const earthRadius = 6371;
  const dLat = toRad(destination.lat - origin.lat);
  const dLon = toRad(destination.lon - origin.lon);
  const lat1 = toRad(origin.lat);
  const lat2 = toRad(destination.lat);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.max(1.8, Number((earthRadius * c * 1.25).toFixed(1)));
}

export function estimateDelivery({ distanceKm, deliveryType, packageSize }) {
  const fuelCost = (distanceKm / pricingConfig.kmPerLiter) * pricingConfig.gasolinePrice;
  const maintenanceCost = distanceKm * pricingConfig.maintenancePerKm;
  const operationalCost = distanceKm * pricingConfig.operationalPerKm;
  const estimatedPrice = fuelCost + maintenanceCost + operationalCost;
  const timeMultiplier = {
    Urbana: 1,
    Intermunicipal: 1.18,
    Programada: 1.05,
    Urgente: 0.92,
    Empresarial: 1.08,
  };
  const estimatedTime = Math.ceil(14 + distanceKm * 2.6 * (timeMultiplier[deliveryType] || 1));

  return {
    distanceKm: Number(distanceKm.toFixed(1)),
    estimatedTime,
    estimatedPrice: Number(estimatedPrice.toFixed(2)),
    pricingBreakdown: {
      fuelCost: Number(fuelCost.toFixed(2)),
      maintenanceCost: Number(maintenanceCost.toFixed(2)),
      operationalCost: Number(operationalCost.toFixed(2)),
      gasolinePrice: pricingConfig.gasolinePrice,
    },
  };
}

export function estimateDeliveryFromRoute({ distanceKm, routeDurationMinutes, deliveryType, packageSize }) {
  const estimate = estimateDelivery({ distanceKm, deliveryType, packageSize });
  if (!routeDurationMinutes) return estimate;

  const typeMultiplier = {
    Urbana: 1,
    Intermunicipal: 1.18,
    Programada: 1.05,
    Urgente: 0.92,
    Empresarial: 1.08,
  };

  return {
    ...estimate,
    estimatedTime: Math.max(8, Math.ceil(routeDurationMinutes * (typeMultiplier[deliveryType] || 1) + 4)),
  };
}

function normalizeSearchQuery(query) {
  return query
    .replace(/\bR\.\s*/gi, 'Rua ')
    .replace(/n[Âºo]\s*/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractHouseNumber(query) {
  const explicitNumber = query.match(/(?:,|\s)n.?\s*(\d{1,6}[a-z]?)/i);
  if (explicitNumber) return explicitNumber[1];
  const numbers = [...query.matchAll(/\b(\d{1,6}[a-z]?)\b/gi)];
  return numbers.at(-1)?.[1] || '';
}

function extractStreetName(query) {
  return query
    .replace(/,\s*n.?\s*\w+/i, '')
    .replace(/\b\d{1,6}[a-z]?\b/i, '')
    .split(',')[0]
    .replace(/\s+/g, ' ')
    .trim();
}

function toRad(value) {
  return (value * Math.PI) / 180;
}
