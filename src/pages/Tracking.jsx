import {
  Bike,
  CheckCircle2,
  Clock3,
  MapPin,
  PackageCheck,
  PackageSearch,
  Phone,
  Route,
  Search,
  ShieldCheck,
  XCircle,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from '../components/Button';
import { companyConfig } from '../data/config';
import { currency, formatAddressWithNumber, formatComplement, shortDate } from '../utils/formatters';
import { getDeliveryProtocol } from '../utils/protocol';
import { getDeliveryRequests } from '../utils/storage';
import {
  findDeliveryByProtocol,
  getTrackingDescription,
  getTrackingHeadline,
  getTrackingSteps,
} from '../utils/tracking';

export default function Tracking() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialProtocol = searchParams.get('protocolo') || '';
  const [protocol, setProtocol] = useState(initialProtocol);
  const [searchedProtocol, setSearchedProtocol] = useState(initialProtocol);
  const requests = useMemo(() => getDeliveryRequests(), []);
  const delivery = useMemo(
    () => findDeliveryByProtocol(requests, searchedProtocol),
    [requests, searchedProtocol],
  );
  const hasSearch = Boolean(searchedProtocol.trim());
  const steps = getTrackingSteps(delivery);

  function submit(event) {
    event.preventDefault();
    const nextProtocol = protocol.trim().toUpperCase();
    setSearchedProtocol(nextProtocol);
    setSearchParams(nextProtocol ? { protocolo: nextProtocol } : {});
  }

  return (
    <section className="bg-zinc-100">
      <div className="relative overflow-hidden bg-carbon text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,35,60,0.32),transparent_34%),linear-gradient(135deg,rgba(255,214,10,0.13),transparent_36%)]" />
        <div className="relative mx-auto grid min-h-[430px] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-yellow-300">Rastreio MB EXPRESS</p>
            <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">
              Acompanhe sua entrega em tempo real
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-300">
              Digite o protocolo recebido no WhatsApp para ver o status da entrega, motoboy alocado,
              previsao, rota e atualizacoes do atendimento.
            </p>
          </div>

          <form onSubmit={submit} className="rounded-lg border border-white/10 bg-white p-4 text-carbon shadow-panel sm:p-6">
            <label className="text-xs font-black uppercase text-zinc-500">Numero do protocolo</label>
            <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                <input
                  className="h-14 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-12 pr-4 text-base font-black uppercase outline-none transition focus:border-express focus:bg-white focus:ring-4 focus:ring-red-100"
                  value={protocol}
                  onChange={(event) => setProtocol(event.target.value)}
                  placeholder="MBX-20260509-AB12"
                />
              </div>
              <Button type="submit" icon={PackageSearch} className="h-14">
                Rastrear
              </Button>
            </div>
            <p className="mt-3 text-sm font-semibold text-zinc-500">
              Voce encontra esse numero na mensagem enviada para o WhatsApp da {companyConfig.name}.
            </p>
          </form>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {delivery ? (
          <TrackingResult delivery={delivery} steps={steps} />
        ) : (
          <EmptyState hasSearch={hasSearch} searchedProtocol={searchedProtocol} />
        )}
      </div>
    </section>
  );
}

function TrackingResult({ delivery, steps }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[0.86fr_1.14fr]">
      <aside className="space-y-5">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-panel">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase text-zinc-500">Status atual</p>
              <h2 className="mt-2 text-3xl font-black leading-tight text-carbon">
                {getTrackingHeadline(delivery)}
              </h2>
            </div>
            <StatusIcon status={delivery.status} />
          </div>
          <p className="mt-4 text-sm leading-7 text-zinc-600">{getTrackingDescription(delivery)}</p>
          <div className="mt-5 rounded-lg bg-carbon p-4 text-white">
            <p className="text-xs font-black uppercase text-zinc-400">Protocolo</p>
            <p className="mt-1 break-all text-2xl font-black text-yellow-300">{getDeliveryProtocol(delivery)}</p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <InfoCard icon={Bike} label="Motoboy" value={delivery.assignedMotoboyName || 'Aguardando alocacao'} />
          <InfoCard icon={Clock3} label="Previsao estimada" value={`${delivery.estimatedTime || '--'} min`} />
          <InfoCard icon={Route} label="Distancia" value={`${delivery.distanceKm || '--'} km`} />
          <InfoCard icon={PackageCheck} label="Valor estimado" value={currency(delivery.estimatedPrice)} />
        </div>
      </aside>

      <main className="space-y-6">
        <div className="rounded-lg border border-zinc-200 bg-white p-6 shadow-panel">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase text-express">Linha do tempo</p>
              <h3 className="mt-1 text-2xl font-black text-carbon">Acompanhamento da entrega</h3>
            </div>
            <p className="text-sm font-bold text-zinc-500">Criado em {shortDate(delivery.createdAt)}</p>
          </div>

          <div className="mt-7 space-y-4">
            {steps.map((step, index) => (
              <TimelineStep key={step.key} step={step} index={index} isLast={index === steps.length - 1} />
            ))}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <RoutePanel delivery={delivery} />
          <ContactPanel delivery={delivery} />
        </div>
      </main>
    </div>
  );
}

function TimelineStep({ step, index, isLast }) {
  const styles = {
    done: 'border-emerald-200 bg-emerald-50 text-emerald-600',
    active: 'border-yellow-200 bg-yellow-50 text-yellow-700 shadow-glow',
    waiting: 'border-zinc-200 bg-zinc-50 text-zinc-400',
    canceled: 'border-red-200 bg-red-50 text-express',
  };
  const connector = step.state === 'done' ? 'bg-emerald-400' : step.state === 'canceled' ? 'bg-express' : 'bg-zinc-200';

  return (
    <div className="relative grid grid-cols-[44px_1fr] gap-4">
      <div className="relative flex justify-center">
        <div className={`grid h-11 w-11 place-items-center rounded-full border-2 ${styles[step.state]}`}>
          {step.state === 'canceled' ? <XCircle size={21} /> : step.state === 'waiting' ? index + 1 : <CheckCircle2 size={21} />}
        </div>
        {!isLast ? <div className={`absolute top-12 h-[calc(100%+16px)] w-1 rounded-full ${connector}`} /> : null}
      </div>
      <div className={`rounded-lg border p-4 ${step.state === 'active' ? 'border-yellow-200 bg-white' : 'border-zinc-200 bg-white'}`}>
        <p className="font-black text-carbon">{step.title}</p>
        <p className="mt-1 text-sm leading-6 text-zinc-600">{step.description}</p>
      </div>
    </div>
  );
}

function RoutePanel({ delivery }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <MapPin className="text-express" size={22} />
        <h4 className="text-lg font-black text-carbon">Rota da entrega</h4>
      </div>
      <div className="space-y-4 text-sm">
        <RoutePoint
          label="Coleta"
          tone="pickup"
          value={formatAddressWithNumber(delivery.pickupAddress, delivery.pickupNumber)}
          complement={formatComplement(delivery.pickupComplement)}
        />
        <RoutePoint
          label="Entrega"
          tone="delivery"
          value={formatAddressWithNumber(delivery.deliveryAddress, delivery.deliveryNumber)}
          complement={formatComplement(delivery.deliveryComplement || delivery.complement)}
        />
      </div>
    </div>
  );
}

function ContactPanel({ delivery }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Phone className="text-express" size={22} />
        <h4 className="text-lg font-black text-carbon">Atendimento</h4>
      </div>
      <p className="text-sm leading-7 text-zinc-600">
        Cliente: <strong className="text-carbon">{delivery.customerName}</strong>
        <br />
        Status interno: <strong className="text-carbon">{delivery.status}</strong>
        <br />
        Motoboy: <strong className="text-carbon">{delivery.assignedMotoboyName || 'Ainda nao alocado'}</strong>
      </p>
    </div>
  );
}

function RoutePoint({ label, value, complement, tone }) {
  const pickup = tone === 'pickup';

  return (
    <div className={`rounded-lg border p-4 ${pickup ? 'border-blue-100 bg-blue-50' : 'border-red-100 bg-red-50'}`}>
      <p className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase text-white ${pickup ? 'bg-blue-700' : 'bg-express'}`}>
        {label}
      </p>
      <p className="mt-1 font-bold leading-6 text-carbon">{value || '-'}</p>
      {complement ? (
        <p className={`mt-2 text-sm font-semibold leading-6 ${pickup ? 'text-blue-800' : 'text-red-800'}`}>
          Complemento: {complement}
        </p>
      ) : null}
    </div>
  );
}

function InfoCard({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <Icon className="mb-3 text-express" size={24} />
      <p className="text-xs font-black uppercase text-zinc-500">{label}</p>
      <p className="mt-1 text-lg font-black text-carbon">{value}</p>
    </div>
  );
}

function StatusIcon({ status }) {
  const isFinished = status === 'Finalizado';
  const isCanceled = status === 'Cancelado';
  const className = isCanceled
    ? 'bg-red-50 text-express'
    : isFinished
      ? 'bg-emerald-50 text-emerald-600'
      : 'bg-yellow-50 text-yellow-700';

  return (
    <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-lg ${className}`}>
      {isCanceled ? <XCircle size={28} /> : isFinished ? <CheckCircle2 size={28} /> : <Bike size={28} />}
    </div>
  );
}

function EmptyState({ hasSearch, searchedProtocol }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-panel">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-zinc-100 text-zinc-500">
        {hasSearch ? <XCircle size={30} /> : <ShieldCheck size={30} />}
      </div>
      <h2 className="mt-5 text-2xl font-black text-carbon">
        {hasSearch ? 'Protocolo nao encontrado' : 'Pronto para rastrear'}
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-600">
        {hasSearch
          ? `Nao encontramos nenhuma entrega com o protocolo ${searchedProtocol}. Confira o numero recebido e tente novamente.`
          : 'Informe o protocolo para acompanhar a entrega. Neste prototipo, os dados ficam salvos no navegador/localStorage.'}
      </p>
    </div>
  );
}
