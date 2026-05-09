import { getDeliveryProtocol } from './protocol';

const finalStatuses = ['Finalizado', 'Cancelado'];

export function findDeliveryByProtocol(requests, protocol) {
  const normalizedProtocol = String(protocol || '').trim().toLowerCase();
  if (!normalizedProtocol) return null;

  return requests.find((request) => getDeliveryProtocol(request).toLowerCase() === normalizedProtocol) || null;
}

export function getTrackingHeadline(request) {
  if (!request) return 'Informe seu protocolo';
  if (request.status === 'Cancelado') return 'Entrega cancelada';
  if (request.status === 'Finalizado') return 'Entrega finalizada';
  if (request.status === 'Em andamento') return `${request.assignedMotoboyName || 'Seu motoboy'} esta a caminho`;
  if (request.assignedMotoboyName) return `${request.assignedMotoboyName} foi alocado`;
  return 'Aguardando entregador';
}

export function getTrackingDescription(request) {
  if (!request) return 'Digite o numero recebido no WhatsApp para acompanhar o pedido.';
  if (request.status === 'Cancelado') return 'Fale com a MB EXPRESS para entender o motivo ou reagendar a entrega.';
  if (request.status === 'Finalizado') return 'A entrega foi concluida. Obrigado por chamar a MB EXPRESS.';
  if (request.status === 'Em andamento') return 'A coleta ou entrega esta em rota. Acompanhe as proximas atualizacoes pelo WhatsApp.';
  if (request.assignedMotoboyName) return 'Seu pedido ja tem motoboy definido e sera iniciado em breve.';
  return 'Recebemos seu pedido e a equipe esta analisando a melhor disponibilidade.';
}

export function getTrackingSteps(request) {
  const status = request?.status;
  const hasMotoboy = Boolean(request?.assignedMotoboyName);
  const isCanceled = status === 'Cancelado';
  const isFinished = status === 'Finalizado';
  const isInProgress = status === 'Em andamento';
  const isAllocated = hasMotoboy || status === 'Motoboy solicitado' || isInProgress || isFinished;

  return [
    {
      key: 'received',
      title: 'Pedido recebido',
      description: 'Protocolo criado e dados salvos no painel.',
      state: request ? 'done' : 'waiting',
    },
    {
      key: 'waiting',
      title: 'Aguardando entregador',
      description: 'A equipe esta conferindo rota, valor e disponibilidade.',
      state: !request ? 'waiting' : isAllocated || finalStatuses.includes(status) ? 'done' : 'active',
    },
    {
      key: 'allocated',
      title: hasMotoboy ? `${request.assignedMotoboyName} foi alocado` : 'Motoboy alocado',
      description: hasMotoboy ? 'Motoboy confirmado para essa entrega.' : 'O nome do motoboy aparecera aqui.',
      state: !request || isCanceled ? 'waiting' : isInProgress || isFinished ? 'done' : isAllocated ? 'active' : 'waiting',
    },
    {
      key: 'route',
      title: hasMotoboy ? `${request.assignedMotoboyName} esta a caminho` : 'Motoboy a caminho',
      description: 'Entrega em andamento na rota informada.',
      state: !request || isCanceled ? 'waiting' : isFinished ? 'done' : isInProgress ? 'active' : 'waiting',
    },
    {
      key: 'finished',
      title: isCanceled ? 'Entrega cancelada' : 'Entrega finalizada',
      description: isCanceled ? 'Atendimento encerrado como cancelado.' : 'Pedido concluido com sucesso.',
      state: !request ? 'waiting' : isCanceled ? 'canceled' : isFinished ? 'active' : 'waiting',
    },
  ];
}
