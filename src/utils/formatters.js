export function formatPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11);
  if (digits.length <= 10) {
    return digits
      .replace(/^(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2');
  }
  return digits
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2');
}

export function formatDate(value) {
  return value
    .replace(/\D/g, '')
    .slice(0, 8)
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2');
}

export function formatPlate(value) {
  return value
    .replace(/[^A-Za-z0-9]/g, '')
    .toUpperCase()
    .slice(0, 7)
    .replace(/^([A-Z]{3})([0-9A-Z])/, '$1-$2');
}

export function currency(value) {
  return Number(value || 0).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function formatAddressWithNumber(address, number) {
  const cleanAddress = String(address || '').trim();
  const cleanNumber = String(number || '').trim();
  if (!cleanNumber) return cleanAddress;
  if (!cleanAddress) return cleanNumber;
  return `${cleanAddress}, nº ${cleanNumber}`;
}

export function formatComplement(value) {
  return String(value || '').trim();
}

export function shortDate(value) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatSchedule(date, time) {
  if (!date) return '-';
  const [year, month, day] = date.split('-');
  const formattedDate = [day, month, year].filter(Boolean).join('/');
  return time ? `${formattedDate} às ${time}` : formattedDate;
}
