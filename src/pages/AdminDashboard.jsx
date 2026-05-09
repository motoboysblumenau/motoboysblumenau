import {
  Bike,
  CalendarClock,
  Check,
  ClipboardList,
  Eye,
  LogOut,
  MessageCircle,
  PackageCheck,
  Plus,
  Search,
  Trash2,
  UserCheck,
  Users,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { deliveryStatuses } from '../data/config';
import { useAuth } from '../context/AuthContext';
import { buildMotoboyRequestMessage, createWhatsappLink } from '../services/whatsappService';
import { currency, formatAddressWithNumber, formatComplement, formatPhone, formatSchedule, shortDate } from '../utils/formatters';
import { getDeliveryProtocol } from '../utils/protocol';
import {
  deleteMotoboy,
  addMotoboy,
  getDeliveryRequests,
  getMotoboys,
  updateDeliveryRequest,
  updateMotoboy,
} from '../utils/storage';

const pendingDeliveryStatuses = ['Novo', 'Em análise', 'Motoboy solicitado', 'Em andamento'];
const quickMotoboyInitial = {
  name: '',
  phone: '',
  city: 'Blumenau',
  hasBox: 'Sim',
  hasMei: 'Sim',
};

export default function AdminDashboard() {
  const { logout } = useAuth();
  const [motoboys, setMotoboys] = useState(() => getMotoboys());
  const [requests, setRequests] = useState(() => getDeliveryRequests());
  const [filter, setFilter] = useState('todos');
  const [requestSearch, setRequestSearch] = useState('');
  const [selectedMotoboy, setSelectedMotoboy] = useState(null);
  const [quickMotoboyOpen, setQuickMotoboyOpen] = useState(false);
  const [quickMotoboy, setQuickMotoboy] = useState(quickMotoboyInitial);
  const [quickMotoboyError, setQuickMotoboyError] = useState('');

  const stats = useMemo(() => {
    const count = (status) => motoboys.filter((motoboy) => motoboy.status === status).length;
    const pendingDeliveries = requests.filter((request) => pendingDeliveryStatuses.includes(request.status)).length;
    const finishedDeliveries = requests.filter((request) => request.status === 'Finalizado').length;
    return [
      { label: 'Motoboys cadastrados', value: motoboys.length, icon: Users },
      { label: 'Pendentes', value: count('pendente'), icon: ClipboardList },
      { label: 'Aprovados', value: count('aprovado'), icon: UserCheck },
      { label: 'Finalizadas', value: finishedDeliveries, icon: PackageCheck },
      { label: 'Entregas pendentes', value: pendingDeliveries, icon: Bike },
    ];
  }, [motoboys, requests]);

  const filteredMotoboys = filter === 'todos' ? motoboys : motoboys.filter((motoboy) => motoboy.status === filter);
  const approvedMotoboys = useMemo(
    () => motoboys.filter((motoboy) => motoboy.status === 'aprovado'),
    [motoboys],
  );

  const pendingRequests = useMemo(
    () => requests.filter((request) => pendingDeliveryStatuses.includes(request.status)),
    [requests],
  );

  const scheduledRequests = useMemo(
    () =>
      requests
        .filter((request) => request.isScheduled)
        .sort((a, b) => `${a.scheduledDate || ''}${a.scheduledTime || ''}`.localeCompare(`${b.scheduledDate || ''}${b.scheduledTime || ''}`)),
    [requests],
  );

  const historyRequests = useMemo(
    () => requests.filter((request) => ['Finalizado', 'Cancelado'].includes(request.status)),
    [requests],
  );

  const filteredRequests = useMemo(() => {
    const term = requestSearch.trim().toLowerCase();
    if (!term) return pendingRequests;

    return pendingRequests.filter((request) =>
      [
        getDeliveryProtocol(request),
        request.customerName,
        request.phone,
        request.pickupAddress,
        request.pickupNumber,
        request.deliveryAddress,
        request.deliveryNumber,
        request.scheduledDate,
        request.scheduledTime,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term)),
    );
  }, [pendingRequests, requestSearch]);

  function changeMotoboyStatus(id, status) {
    setMotoboys(updateMotoboy(id, { status }));
  }

  function removeMotoboy(id) {
    setMotoboys(deleteMotoboy(id));
    setSelectedMotoboy(null);
  }

  function changeDeliveryStatus(id, status) {
    setRequests(updateDeliveryRequest(id, { status }));
  }

  function assignMotoboyToDelivery(requestId, motoboyId) {
    if (!motoboyId) {
      setRequests(updateDeliveryRequest(requestId, {
        assignedMotoboyId: '',
        assignedMotoboyName: '',
        assignedMotoboyPhone: '',
        assignedAt: '',
        status: 'Em análise',
      }));
      return;
    }

    const motoboy = approvedMotoboys.find((item) => item.id === motoboyId);
    if (!motoboy) return;

    setRequests(updateDeliveryRequest(requestId, {
      assignedMotoboyId: motoboy.id,
      assignedMotoboyName: motoboy.name,
      assignedMotoboyPhone: motoboy.phone,
      assignedAt: new Date().toISOString(),
      status: 'Motoboy solicitado',
    }));
  }

  function updateQuickMotoboy(field, value) {
    setQuickMotoboy((current) => ({ ...current, [field]: value }));
    setQuickMotoboyError('');
  }

  function createApprovedMotoboy(event) {
    event.preventDefault();
    if (!quickMotoboy.name.trim() || !quickMotoboy.phone.trim()) {
      setQuickMotoboyError('Informe pelo menos nome e WhatsApp.');
      return;
    }

    const saved = addMotoboy({
      name: quickMotoboy.name.trim(),
      birthDate: '-',
      phone: quickMotoboy.phone,
      city: quickMotoboy.city || 'Blumenau',
      hasBox: quickMotoboy.hasBox === 'Sim',
      hasMei: quickMotoboy.hasMei === 'Sim',
      acceptedTerms: true,
      status: 'aprovado',
      createdByAdmin: true,
    });
    setMotoboys((current) => [saved, ...current]);
    setQuickMotoboy(quickMotoboyInitial);
    setQuickMotoboyOpen(false);
  }

  return (
    <section className="bg-zinc-100 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase text-express">Painel MB EXPRESS</p>
            <h1 className="mt-2 text-3xl font-black text-carbon sm:text-4xl">Dashboard administrativo</h1>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button icon={Plus} onClick={() => setQuickMotoboyOpen(true)}>Cadastrar motoboy aprovado</Button>
            <Button variant="dark" icon={LogOut} onClick={logout}>Sair</Button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
              <stat.icon className="mb-4 text-express" size={24} />
              <p className="text-3xl font-black text-carbon">{stat.value}</p>
              <p className="mt-1 text-sm font-semibold text-zinc-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-panel">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-black text-carbon">Motoboys</h2>
              <select className="rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-bold" value={filter} onChange={(event) => setFilter(event.target.value)}>
                <option value="todos">Todos</option>
                <option value="pendente">Pendentes</option>
                <option value="aprovado">Aprovados</option>
                <option value="reprovado">Reprovados</option>
              </select>
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-zinc-200 text-xs uppercase text-zinc-500">
                  <tr>
                    <th className="py-3">Nome</th>
                    <th className="py-3">Cidade</th>
                    <th className="py-3">Baú</th>
                    <th className="py-3">MEI</th>
                    <th className="py-3">Status</th>
                    <th className="py-3">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredMotoboys.map((motoboy) => (
                    <tr key={motoboy.id}>
                      <td className="py-4 font-bold text-carbon">{motoboy.name}</td>
                      <td className="py-4 text-zinc-600">{motoboy.city}</td>
                      <td className="py-4 text-zinc-600">{motoboy.hasBox ? 'Sim' : 'Não'}</td>
                      <td className="py-4 text-zinc-600">{motoboy.hasMei ? 'Sim' : 'Não'}</td>
                      <td className="py-4"><StatusBadge status={motoboy.status} /></td>
                      <td className="py-4">
                        <div className="flex flex-wrap gap-2">
                          <IconButton title="Ver detalhes" icon={Eye} onClick={() => setSelectedMotoboy(motoboy)} />
                          <IconButton title="Aprovar" icon={Check} onClick={() => changeMotoboyStatus(motoboy.id, 'aprovado')} />
                          <IconButton title="Reprovar" icon={X} onClick={() => changeMotoboyStatus(motoboy.id, 'reprovado')} />
                          <IconButton title="Excluir" icon={Trash2} danger onClick={() => removeMotoboy(motoboy.id)} />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-panel">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-xl font-black text-carbon">Entregas pendentes ({pendingRequests.length})</h2>
              <label className="relative block sm:w-72">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={17} />
                <input
                  className="w-full rounded-lg border border-zinc-200 bg-white py-3 pl-10 pr-4 text-sm font-bold outline-none transition focus:border-express focus:ring-4 focus:ring-red-100"
                  value={requestSearch}
                  onChange={(event) => setRequestSearch(event.target.value)}
                  placeholder="Buscar protocolo"
                />
              </label>
            </div>
            <div className="mt-5 max-h-[760px] space-y-4 overflow-y-auto pr-2">
              {filteredRequests.map((request) => (
                <article key={request.id} className="rounded-lg border border-zinc-200 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="mb-2 inline-flex rounded-full bg-carbon px-3 py-1 text-xs font-black text-yellow-300">
                        {getDeliveryProtocol(request)}
                      </p>
                      {request.isScheduled ? (
                        <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                          <CalendarClock size={14} /> Entrega agendada: {formatSchedule(request.scheduledDate, request.scheduledTime)}
                        </p>
                      ) : null}
                      <p className="font-black text-carbon">{request.customerName}</p>
                      <RouteSummary request={request} />
                      <p className="mt-2 text-sm font-bold text-zinc-800">
                        {request.distanceKm} km • {request.estimatedTime} min • {currency(request.estimatedPrice)}
                      </p>
                      {request.notes ? (
                        <div className="mt-3 rounded-lg bg-zinc-100 p-3">
                          <p className="text-xs font-black uppercase text-zinc-500">Observações</p>
                          <p className="mt-1 text-sm font-semibold leading-6 text-zinc-700">{request.notes}</p>
                        </div>
                      ) : null}
                    </div>
                    <StatusBadge status={request.status} />
                  </div>
                  <div className="mt-4 grid gap-3">
                    <div className="grid gap-3 md:grid-cols-2">
                      <label>
                        <span className="mb-1 block text-xs font-black uppercase text-zinc-500">Motoboy alocado</span>
                        <select
                          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-bold"
                          value={request.assignedMotoboyId || ''}
                          onChange={(event) => assignMotoboyToDelivery(request.id, event.target.value)}
                        >
                          <option value="">Aguardando alocação</option>
                          {approvedMotoboys.map((motoboy) => (
                            <option key={motoboy.id} value={motoboy.id}>{motoboy.name}</option>
                          ))}
                        </select>
                      </label>
                      <label>
                        <span className="mb-1 block text-xs font-black uppercase text-zinc-500">Status do rastreio</span>
                        <select
                          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-bold"
                          value={request.status}
                          onChange={(event) => changeDeliveryStatus(request.id, event.target.value)}
                        >
                          {deliveryStatuses.map((status) => (
                            <option key={status}>{status}</option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <a
                      className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-400"
                      href={createWhatsappLink(buildMotoboyRequestMessage(request))}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle size={17} /> WhatsApp
                    </a>
                  </div>
                </article>
              ))}
              {!filteredRequests.length ? (
                <div className="rounded-lg border border-dashed border-zinc-300 p-5 text-center text-sm font-bold text-zinc-500">
                  Nenhuma entrega pendente encontrada para este protocolo.
                </div>
              ) : null}
            </div>
          </section>
        </div>

        <section className="mt-6 rounded-lg border border-zinc-200 bg-white p-5 shadow-panel">
          <div className="flex items-center gap-2">
            <CalendarClock className="text-express" size={24} />
            <h2 className="text-xl font-black text-carbon">Calendário de entregas agendadas</h2>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {scheduledRequests.map((request) => (
              <article key={request.id} className="rounded-lg border border-blue-100 bg-blue-50 p-4">
                <p className="inline-flex rounded-full bg-blue-700 px-3 py-1 text-xs font-black text-white">
                  {formatSchedule(request.scheduledDate, request.scheduledTime)}
                </p>
                <p className="mt-3 text-sm font-black text-carbon">{getDeliveryProtocol(request)}</p>
                <p className="mt-1 text-sm font-bold text-zinc-700">{request.customerName}</p>
                <RouteSummary request={request} compact />
                <div className="mt-3 flex items-center justify-between gap-3">
                  <StatusBadge status={request.status} />
                  <span className="text-xs font-black text-zinc-500">{currency(request.estimatedPrice)}</span>
                </div>
              </article>
            ))}
            {!scheduledRequests.length ? (
              <div className="rounded-lg border border-dashed border-zinc-300 p-5 text-sm font-bold text-zinc-500">
                Nenhuma entrega agendada no momento.
              </div>
            ) : null}
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-zinc-200 bg-white p-5 shadow-panel">
          <div className="flex items-center gap-2">
            <PackageCheck className="text-express" size={24} />
            <h2 className="text-xl font-black text-carbon">Histórico de entregas</h2>
          </div>
          <div className="mt-5 max-h-[520px] space-y-4 overflow-y-auto pr-2">
            {historyRequests.map((request) => (
              <article key={request.id} className="rounded-lg border border-zinc-200 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="mb-2 inline-flex rounded-full bg-zinc-100 px-3 py-1 text-xs font-black text-zinc-700">
                      {getDeliveryProtocol(request)}
                    </p>
                    <p className="font-black text-carbon">{request.customerName}</p>
                    <RouteSummary request={request} />
                    <p className="mt-2 text-sm font-bold text-zinc-800">
                      {request.distanceKm} km • {request.estimatedTime} min • {currency(request.estimatedPrice)}
                    </p>
                    {request.notes ? (
                      <p className="mt-2 text-sm font-semibold leading-6 text-zinc-600">
                        Observações: {request.notes}
                      </p>
                    ) : null}
                  </div>
                  <StatusBadge status={request.status} />
                </div>
              </article>
            ))}
            {!historyRequests.length ? (
              <div className="rounded-lg border border-dashed border-zinc-300 p-5 text-sm font-bold text-zinc-500">
                Nenhuma entrega finalizada ou cancelada ainda.
              </div>
            ) : null}
          </div>
        </section>
      </div>

      {selectedMotoboy ? (
        <MotoboyModal
          motoboy={selectedMotoboy}
          onClose={() => setSelectedMotoboy(null)}
          onApprove={() => changeMotoboyStatus(selectedMotoboy.id, 'aprovado')}
          onReject={() => changeMotoboyStatus(selectedMotoboy.id, 'reprovado')}
          onDelete={() => removeMotoboy(selectedMotoboy.id)}
        />
      ) : null}

      {quickMotoboyOpen ? (
        <QuickMotoboyModal
          form={quickMotoboy}
          error={quickMotoboyError}
          onChange={updateQuickMotoboy}
          onSubmit={createApprovedMotoboy}
          onClose={() => setQuickMotoboyOpen(false)}
        />
      ) : null}
    </section>
  );
}

function QuickMotoboyModal({ form, error, onChange, onSubmit, onClose }) {
  return (
    <div className="fixed inset-0 z-[1300] grid place-items-center bg-black/65 p-4">
      <form className="w-full max-w-lg rounded-lg bg-white p-6 shadow-panel" onSubmit={onSubmit}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase text-express">Cadastro rápido</p>
            <h3 className="mt-1 text-2xl font-black text-carbon">Motoboy aprovado</h3>
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-lg bg-zinc-100" type="button" onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        <div className="mt-6 grid gap-4">
          <label>
            <span className="mb-1 block text-xs font-black uppercase text-zinc-500">Nome completo</span>
            <input
              className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-express focus:ring-4 focus:ring-red-100"
              value={form.name}
              onChange={(event) => onChange('name', event.target.value)}
              placeholder="Ex.: Rafael Mendes"
            />
          </label>
          <label>
            <span className="mb-1 block text-xs font-black uppercase text-zinc-500">WhatsApp</span>
            <input
              className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-express focus:ring-4 focus:ring-red-100"
              value={form.phone}
              onChange={(event) => onChange('phone', formatPhone(event.target.value))}
              placeholder="(47) 99999-9999"
            />
          </label>
          <label>
            <span className="mb-1 block text-xs font-black uppercase text-zinc-500">Cidade</span>
            <input
              className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-bold outline-none focus:border-express focus:ring-4 focus:ring-red-100"
              value={form.city}
              onChange={(event) => onChange('city', event.target.value)}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className="mb-1 block text-xs font-black uppercase text-zinc-500">Possui baú?</span>
              <select className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-bold" value={form.hasBox} onChange={(event) => onChange('hasBox', event.target.value)}>
                <option>Sim</option>
                <option>Não</option>
              </select>
            </label>
            <label>
              <span className="mb-1 block text-xs font-black uppercase text-zinc-500">Possui MEI?</span>
              <select className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm font-bold" value={form.hasMei} onChange={(event) => onChange('hasMei', event.target.value)}>
                <option>Sim</option>
                <option>Não</option>
              </select>
            </label>
          </div>
        </div>

        {error ? <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm font-bold text-express">{error}</p> : null}

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button type="submit" icon={Plus}>Salvar aprovado</Button>
          <Button type="button" variant="ghost" icon={X} onClick={onClose}>Cancelar</Button>
        </div>
      </form>
    </div>
  );
}

function RouteSummary({ request, compact = false }) {
  const pickupComplement = formatComplement(request.pickupComplement);
  const deliveryComplement = formatComplement(request.deliveryComplement || request.complement);

  return (
    <div className={compact ? 'mt-3 grid gap-2 text-xs' : 'mt-3 grid gap-3 text-sm md:grid-cols-2'}>
      <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
        <p className="mb-1 inline-flex rounded-full bg-blue-700 px-2 py-0.5 text-[10px] font-black uppercase text-white">
          Coleta
        </p>
        <p className="font-semibold leading-5 text-zinc-700">
          {formatAddressWithNumber(request.pickupAddress, request.pickupNumber)}
        </p>
        {pickupComplement ? <p className="mt-1 font-semibold leading-5 text-blue-800">Complemento: {pickupComplement}</p> : null}
      </div>
      <div className="rounded-lg border border-red-100 bg-red-50 p-3">
        <p className="mb-1 inline-flex rounded-full bg-express px-2 py-0.5 text-[10px] font-black uppercase text-white">
          Entrega
        </p>
        <p className="font-semibold leading-5 text-zinc-700">
          {formatAddressWithNumber(request.deliveryAddress, request.deliveryNumber)}
        </p>
        {deliveryComplement ? <p className="mt-1 font-semibold leading-5 text-red-800">Complemento: {deliveryComplement}</p> : null}
      </div>
    </div>
  );
}

function IconButton({ icon: Icon, title, onClick, danger = false }) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      className={`grid h-9 w-9 place-items-center rounded-lg transition ${
        danger ? 'bg-red-50 text-express hover:bg-red-100' : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
      }`}
    >
      <Icon size={17} />
    </button>
  );
}

function MotoboyModal({ motoboy, onClose, onApprove, onReject, onDelete }) {
  return (
    <div className="fixed inset-0 z-[1300] grid place-items-center bg-black/65 p-4">
      <div className="w-full max-w-xl rounded-lg bg-white p-6 shadow-panel">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-black text-carbon">{motoboy.name}</h3>
            <p className="mt-1 text-sm text-zinc-500">Cadastro em {shortDate(motoboy.createdAt)}</p>
          </div>
          <button className="grid h-10 w-10 place-items-center rounded-lg bg-zinc-100" onClick={onClose} aria-label="Fechar">
            <X size={20} />
          </button>
        </div>
        <div className="mt-6 grid gap-3 text-sm sm:grid-cols-2">
          <Detail label="Nascimento" value={motoboy.birthDate} />
          <Detail label="WhatsApp" value={motoboy.phone} />
          <Detail label="Cidade" value={motoboy.city} />
          <Detail label="Possui baú" value={motoboy.hasBox ? 'Sim' : 'Não'} />
          <Detail label="Possui MEI" value={motoboy.hasMei ? 'Sim' : 'Não'} />
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button type="button" icon={Check} onClick={onApprove}>Aprovar</Button>
          <Button type="button" variant="dark" icon={X} onClick={onReject}>Reprovar</Button>
          <Button type="button" variant="ghost" icon={Trash2} onClick={onDelete}>Excluir</Button>
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div className="rounded-lg bg-zinc-100 p-4">
      <p className="text-xs font-black uppercase text-zinc-500">{label}</p>
      <p className="mt-1 font-bold text-carbon">{value}</p>
    </div>
  );
}
