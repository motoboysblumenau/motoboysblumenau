export function generateDeliveryProtocol(date = new Date()) {
  const day = date.toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `MBX-${day}-${randomPart}`;
}

export function getDeliveryProtocol(delivery) {
  return delivery?.protocol || delivery?.id || 'SEM-PROTOCOLO';
}
