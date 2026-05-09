import { companyConfig } from '../data/config';
import { currency, formatAddressWithNumber, formatComplement, formatSchedule } from '../utils/formatters';
import { getDeliveryProtocol } from '../utils/protocol';

export function createWhatsappLink(message, phone = companyConfig.whatsappNumber) {
  const sanitizedPhone = phone.replace(/\D/g, '');
  return `https://wa.me/${sanitizedPhone}?text=${encodeURIComponent(message)}`;
}

export function buildQuoteMessage(quote) {
  const pickupAddress = formatAddressWithNumber(quote.pickupAddress, quote.pickupNumber);
  const deliveryAddress = formatAddressWithNumber(quote.deliveryAddress, quote.deliveryNumber);
  const pickupComplement = formatComplement(quote.pickupComplement);
  const deliveryComplement = formatComplement(quote.deliveryComplement || quote.complement);

  return [
    `Olá, MB EXPRESS! Quero solicitar uma entrega.`,
    ``,
    `Cliente: ${quote.customerName}`,
    `WhatsApp: ${quote.phone}`,
    `Coleta: ${pickupAddress}`,
    pickupComplement ? `Complemento da coleta: ${pickupComplement}` : null,
    `Entrega: ${deliveryAddress}`,
    deliveryComplement ? `Complemento da entrega: ${deliveryComplement}` : null,
    `Tipo: ${quote.deliveryType}`,
    `Peso: ${quote.weight}`,
    `Pacote: ${quote.packageSize}`,
    quote.isScheduled ? `Agendada para: ${formatSchedule(quote.scheduledDate, quote.scheduledTime)}` : null,
    quote.notes ? `Observações: ${quote.notes}` : null,
    ``,
    `Distância estimada: ${quote.distanceKm} km`,
    `Tempo estimado: ${quote.estimatedTime} min`,
    `Valor estimado: ${currency(quote.estimatedPrice)}`,
  ]
    .filter(Boolean)
    .join('\n');
}

export function buildProtocolWhatsappMessage(quote) {
  return [
    `Olá, MB EXPRESS!`,
    `Meu protocolo de entrega é: ${getDeliveryProtocol(quote)}`,
    ``,
    `Por favor, confirme minha solicitação.`,
  ].join('\n');
}

export function buildMotoboyRequestMessage(request) {
  const pickupAddress = formatAddressWithNumber(request.pickupAddress, request.pickupNumber);
  const deliveryAddress = formatAddressWithNumber(request.deliveryAddress, request.deliveryNumber);
  const pickupComplement = formatComplement(request.pickupComplement);
  const deliveryComplement = formatComplement(request.deliveryComplement || request.complement);

  return [
    `Nova solicitação MB EXPRESS`,
    `Protocolo: ${getDeliveryProtocol(request)}`,
    `Cliente: ${request.customerName}`,
    `Coleta: ${pickupAddress}`,
    pickupComplement ? `Complemento da coleta: ${pickupComplement}` : null,
    `Entrega: ${deliveryAddress}`,
    deliveryComplement ? `Complemento da entrega: ${deliveryComplement}` : null,
    request.isScheduled ? `Agendada para: ${formatSchedule(request.scheduledDate, request.scheduledTime)}` : null,
    request.assignedMotoboyName ? `Motoboy: ${request.assignedMotoboyName}` : null,
    `Status: ${request.status}`,
    `Valor estimado: ${currency(request.estimatedPrice)}`,
  ]
    .filter(Boolean)
    .join('\n');
}

export async function sendToFutureBotWebhook(payload) {
  // Integração futura:
  // enviar payload para a API/webhook do bot hospedado na Discloud.
  // Este projeto não usa WhatsApp Cloud API; o bot poderá receber estes dados
  // por endpoint próprio e seguir com a sessão remota já usada na operação.
  return {
    ok: true,
    queued: false,
    payload,
  };
}
