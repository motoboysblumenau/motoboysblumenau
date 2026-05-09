import { CalendarClock, CheckCircle2, Copy, MessageCircle, Package, Route, Send, Timer } from 'lucide-react';
import { useMemo, useState } from 'react';
import AddressAutocomplete from '../components/AddressAutocomplete';
import Button from '../components/Button';
import FormField, { inputClass } from '../components/FormField';
import QuoteMap from '../components/QuoteMap';
import SectionTitle from '../components/SectionTitle';
import {
  calculateDistanceKm,
  calculateRoadRoute,
  estimateDeliveryFromRoute,
  resolveBestAddress,
} from '../services/mapService';
import {
  buildProtocolWhatsappMessage,
  createWhatsappLink,
  sendToFutureBotWebhook,
} from '../services/whatsappService';
import { addDeliveryRequest } from '../utils/storage';
import { currency, formatAddressWithNumber, formatPhone } from '../utils/formatters';
import { requiredFields, hasErrors } from '../utils/validation';

const initialForm = {
  customerName: '',
  phone: '',
  pickupAddress: '',
  pickupNumber: '',
  pickupComplement: '',
  deliveryAddress: '',
  deliveryNumber: '',
  deliveryComplement: '',
  deliveryType: 'Urbana',
  weight: 'Até 2 kg',
  packageSize: 'Pequeno',
  isScheduled: false,
  scheduledDate: '',
  scheduledTime: '',
  notes: '',
};

export default function Quote() {
  const [form, setForm] = useState(initialForm);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [adjustMode, setAdjustMode] = useState(null);
  const [estimate, setEstimate] = useState(null);
  const [errors, setErrors] = useState({});
  const [summary, setSummary] = useState('');
  const [createdRequest, setCreatedRequest] = useState(null);
  const [copied, setCopied] = useState(false);

  const quotePayload = useMemo(
    () =>
      estimate
        ? {
            ...form,
            ...estimate,
            status: 'Novo',
          }
        : null,
    [form, estimate],
  );

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setSummary('');
    setCreatedRequest(null);
    setCopied(false);
    if (['pickupAddress', 'pickupNumber', 'deliveryAddress', 'deliveryNumber', 'deliveryType', 'packageSize'].includes(field)) {
      setEstimate(null);
      setRouteCoordinates([]);
    }
  }

  async function resolveAddress(text, number, selected) {
    const fullAddress = formatAddressWithNumber(text, number);
    if (selected?.manuallyAdjusted) return { ...selected, label: fullAddress };
    if (selected) return { ...selected, label: fullAddress };
    const result = await resolveBestAddress(fullAddress);
    return result ? { ...result, label: fullAddress } : null;
  }

  async function calculate() {
    const nextErrors = requiredFields(form, {
      customerName: 'Nome do cliente',
      phone: 'Telefone/WhatsApp',
      pickupAddress: 'Endereço de coleta',
      pickupNumber: 'Número da coleta',
      deliveryAddress: 'Endereço de entrega',
      deliveryNumber: 'Número da entrega',
    });
    if (form.isScheduled && !form.scheduledDate) {
      nextErrors.scheduledDate = 'Data do agendamento';
    }
    if (form.isScheduled && !form.scheduledTime) {
      nextErrors.scheduledTime = 'Horário do agendamento';
    }
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return null;

    const resolvedOrigin = await resolveAddress(form.pickupAddress, form.pickupNumber, origin);
    const resolvedDestination = await resolveAddress(form.deliveryAddress, form.deliveryNumber, destination);
    const roadRoute = await calculateRoadRoute(resolvedOrigin, resolvedDestination);
    const manualDistance = 7.5;
    const distanceKm =
      roadRoute?.distanceKm ||
      (resolvedOrigin && resolvedDestination ? calculateDistanceKm(resolvedOrigin, resolvedDestination) : manualDistance);
    const nextEstimate = estimateDeliveryFromRoute({
      distanceKm,
      routeDurationMinutes: roadRoute?.durationMinutes,
      deliveryType: form.deliveryType,
      packageSize: form.packageSize,
    });
    const estimateWithProvider = {
      ...nextEstimate,
      routeProvider: roadRoute?.provider || 'OpenStreetMap aproximado',
    };

    setOrigin(resolvedOrigin || { label: formatAddressWithNumber(form.pickupAddress, form.pickupNumber), lat: -26.9189, lon: -49.0661 });
    setDestination(resolvedDestination || { label: formatAddressWithNumber(form.deliveryAddress, form.deliveryNumber), lat: -26.9028, lon: -49.1079 });
    setRouteCoordinates(roadRoute?.coordinates || []);
    setEstimate(estimateWithProvider);
    setSummary('');
    setCreatedRequest(null);
    setCopied(false);
    return estimateWithProvider;
  }

  function handleMapPointChange(type, point) {
    if (type === 'origin') {
      setOrigin(point);
    } else {
      setDestination(point);
    }
    setRouteCoordinates([]);
    setEstimate(null);
    setSummary('');
    setCreatedRequest(null);
    setCopied(false);
    setAdjustMode(null);
  }

  async function requestMotoboy() {
    if (createdRequest) return;

    const nextEstimate = estimate || (await calculate());
    if (!nextEstimate) return;

    const saved = addDeliveryRequest({
      ...form,
      ...nextEstimate,
      status: 'Novo',
    });
    const message = buildProtocolWhatsappMessage(saved);
    setSummary(message);
    setCreatedRequest(saved);
    setCopied(false);
    window.open(createWhatsappLink(message), '_blank', 'noopener,noreferrer');
    await sendToFutureBotWebhook(saved);
  }

  async function copyProtocol() {
    if (!createdRequest?.protocol) return;
    await navigator.clipboard?.writeText(createdRequest.protocol);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section className="bg-zinc-100 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Orçamento"
          title="Calcule sua entrega com origem, destino e mapa"
          description="Preencha os dados, selecione endereços sugeridos e gere uma estimativa pronta para acionar a MB EXPRESS pelo WhatsApp."
        />

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <form className="rounded-lg border border-zinc-200 bg-white p-5 shadow-panel sm:p-7" onSubmit={(event) => event.preventDefault()}>
            <div className="grid gap-5 md:grid-cols-2">
              <FormField label="Nome do cliente" error={errors.customerName}>
                <input
                  className={inputClass}
                  value={form.customerName}
                  onChange={(event) => update('customerName', event.target.value)}
                  placeholder="Ex.: Ana Souza"
                />
              </FormField>
              <FormField label="Telefone/WhatsApp" error={errors.phone}>
                <input
                  className={inputClass}
                  value={form.phone}
                  onChange={(event) => update('phone', formatPhone(event.target.value))}
                  placeholder="(47) 99999-9999"
                />
              </FormField>
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 md:col-span-2">
                <p className="mb-4 inline-flex rounded-full bg-blue-700 px-3 py-1 text-xs font-black uppercase text-white">
                  Coleta
                </p>
                <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_160px]">
                  <AddressAutocomplete
                    label="Rua/endereço de coleta"
                    value={form.pickupAddress}
                    onChange={(value) => {
                      update('pickupAddress', value);
                      setOrigin(null);
                    }}
                    onSelect={setOrigin}
                    error={errors.pickupAddress}
                    placeholder="Rua D..."
                  />
                  <FormField label="Número da coleta" error={errors.pickupNumber}>
                    <input
                      className={`${inputClass} focus:border-blue-600 focus:ring-blue-100`}
                      value={form.pickupNumber}
                      onChange={(event) => update('pickupNumber', event.target.value)}
                      placeholder="123"
                    />
                  </FormField>
                </div>
                <FormField label="Complemento da coleta" className="mt-5">
                  <input
                    className={`${inputClass} focus:border-blue-600 focus:ring-blue-100`}
                    value={form.pickupComplement}
                    onChange={(event) => update('pickupComplement', event.target.value)}
                    placeholder="Prédio, sala, portaria, referência da coleta"
                  />
                </FormField>
              </div>
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 md:col-span-2">
                <p className="mb-4 inline-flex rounded-full bg-express px-3 py-1 text-xs font-black uppercase text-white">
                  Entrega
                </p>
                <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_160px]">
                  <AddressAutocomplete
                    label="Rua/endereço de entrega"
                    value={form.deliveryAddress}
                    onChange={(value) => {
                      update('deliveryAddress', value);
                      setDestination(null);
                    }}
                    onSelect={setDestination}
                    error={errors.deliveryAddress}
                    placeholder="Rua Amazonas, Garcia..."
                  />
                  <FormField label="Número da entrega" error={errors.deliveryNumber}>
                    <input
                      className={inputClass}
                      value={form.deliveryNumber}
                      onChange={(event) => update('deliveryNumber', event.target.value)}
                      placeholder="456"
                    />
                  </FormField>
                </div>
                <FormField label="Complemento da entrega" className="mt-5">
                  <input
                    className={inputClass}
                    value={form.deliveryComplement}
                    onChange={(event) => update('deliveryComplement', event.target.value)}
                    placeholder="Apartamento, sala, recepção, referência da entrega"
                  />
                </FormField>
              </div>
              <FormField label="Tipo de entrega">
                <select
                  className={inputClass}
                  value={form.deliveryType}
                  onChange={(event) => update('deliveryType', event.target.value)}
                >
                  <option>Urbana</option>
                  <option>Intermunicipal</option>
                  <option>Programada</option>
                  <option>Urgente</option>
                  <option>Empresarial</option>
                </select>
              </FormField>
              <FormField label="Peso aproximado">
                <select className={inputClass} value={form.weight} onChange={(event) => update('weight', event.target.value)}>
                  <option>Até 2 kg</option>
                  <option>Até 5 kg</option>
                  <option>Até 10 kg</option>
                  <option>Sob consulta</option>
                </select>
              </FormField>
              <FormField label="Tamanho do pacote">
                <select className={inputClass} value={form.packageSize} onChange={(event) => update('packageSize', event.target.value)}>
                  <option>Envelope</option>
                  <option>Pequeno</option>
                  <option>Médio</option>
                  <option>Grande</option>
                </select>
              </FormField>
              <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 md:col-span-2">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={form.isScheduled}
                    onChange={(event) => update('isScheduled', event.target.checked)}
                    className="h-5 w-5 accent-blue-600"
                  />
                  <span className="text-sm font-black text-carbon">Você quer agendar essa entrega?</span>
                </label>
                {form.isScheduled ? (
                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    <FormField label="Data do agendamento" error={errors.scheduledDate}>
                      <input
                        type="date"
                        className={inputClass}
                        value={form.scheduledDate}
                        onChange={(event) => update('scheduledDate', event.target.value)}
                      />
                    </FormField>
                    <FormField label="Horário do agendamento" error={errors.scheduledTime}>
                      <input
                        type="time"
                        className={inputClass}
                        value={form.scheduledTime}
                        onChange={(event) => update('scheduledTime', event.target.value)}
                      />
                    </FormField>
                  </div>
                ) : null}
              </div>
              <FormField label="Observações" className="md:col-span-2">
                <textarea
                  className={`${inputClass} min-h-28 resize-y`}
                  value={form.notes}
                  onChange={(event) => update('notes', event.target.value)}
                  placeholder="Horário desejado, cuidados com o pacote, contato no local..."
                />
              </FormField>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button type="button" icon={Route} onClick={calculate}>
                Calcular orçamento
              </Button>
              <Button type="button" variant="dark" icon={Send} onClick={requestMotoboy} disabled={Boolean(createdRequest)}>
                {createdRequest ? 'Solicitação enviada' : 'Solicitar motoboy'}
              </Button>
            </div>
            {createdRequest ? (
              <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm font-bold text-emerald-800">
                Solicitação já gerada. Use o protocolo abaixo para abrir o WhatsApp, copiar ou rastrear o pedido.
              </p>
            ) : null}
          </form>

          <aside className="space-y-5">
            <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-panel">
              <QuoteMap
                origin={origin}
                destination={destination}
                routeCoordinates={routeCoordinates}
                adjustMode={adjustMode}
                onOriginChange={(point) => handleMapPointChange('origin', point)}
                onDestinationChange={(point) => handleMapPointChange('destination', point)}
              />
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setAdjustMode((current) => (current === 'origin' ? null : 'origin'))}
                  className={`rounded-lg px-4 py-3 text-sm font-black transition ${
                    adjustMode === 'origin'
                      ? 'bg-carbon text-white'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  Ajustar coleta no mapa
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustMode((current) => (current === 'destination' ? null : 'destination'))}
                  className={`rounded-lg px-4 py-3 text-sm font-black transition ${
                    adjustMode === 'destination'
                      ? 'bg-express text-white'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                  }`}
                >
                  Ajustar entrega no mapa
                </button>
              </div>
              <p className="mt-3 px-1 text-xs font-semibold text-zinc-500">
                Se o número cair no local errado, arraste o pino A ou B para a posição correta e clique em calcular novamente.
              </p>
              {estimate?.routeProvider ? (
                <p className="mt-2 px-1 text-xs font-bold text-zinc-600">
                  Rota calculada via {estimate.routeProvider}.
                </p>
              ) : null}
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Metric icon={Route} label="Distância" value={estimate ? `${estimate.distanceKm} km` : '--'} />
              <Metric icon={Timer} label="Tempo" value={estimate ? `${estimate.estimatedTime} min` : '--'} />
              <Metric icon={Package} label="Valor" value={estimate ? currency(estimate.estimatedPrice) : '--'} />
            </div>

            {estimate?.pricingBreakdown ? (
              <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center gap-2 font-black text-carbon">
                  <CalendarClock size={19} className="text-express" />
                  Base do cálculo
                </div>
                <div className="grid gap-2 text-sm font-semibold text-zinc-600">
                  <p>Combustível: {currency(estimate.pricingBreakdown.fuelCost)}</p>
                  <p>Manutenção: {currency(estimate.pricingBreakdown.maintenanceCost)}</p>
                  <p>Operacional: {currency(estimate.pricingBreakdown.operationalCost)}</p>
                </div>
              </div>
            ) : null}

            {quotePayload ? (
              <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                <h3 className="text-lg font-black text-carbon">Resumo do pedido</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">
                  {quotePayload.customerName}, sua estimativa está pronta. Ao solicitar, vamos gerar um protocolo
                  de atendimento para você confirmar a entrega pelo WhatsApp.
                </p>
              </div>
            ) : null}

            {createdRequest ? (
              <div className="rounded-lg bg-carbon p-5 text-white shadow-panel">
                <div className="mb-3 flex items-center gap-2 font-black">
                  <MessageCircle size={19} className="text-emerald-400" />
                  Protocolo gerado
                </div>
                <p className="text-sm leading-6 text-zinc-300">
                  Envie este número para a MB EXPRESS no WhatsApp para confirmar sua solicitação. Guarde o protocolo
                  para acompanhar o andamento da entrega.
                </p>
                <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-black uppercase text-zinc-400">Numero do protocolo</p>
                  <p className="mt-1 break-all text-2xl font-black text-white">{createdRequest.protocol}</p>
                </div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <a
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-3 text-sm font-black text-white transition hover:bg-emerald-400"
                    href={createWhatsappLink(summary)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <MessageCircle size={17} /> Abrir WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={copyProtocol}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 text-sm font-black text-carbon transition hover:bg-zinc-200"
                  >
                    {copied ? <CheckCircle2 size={17} /> : <Copy size={17} />}
                    {copied ? 'Copiado' : 'Copiar protocolo'}
                  </button>
                  <Button
                    to={`/rastreio?protocolo=${encodeURIComponent(createdRequest.protocol)}`}
                    variant="light"
                    icon={Route}
                    className="sm:col-span-2"
                  >
                    Rastrear pedido
                  </Button>
                </div>
                <pre className="mt-4 whitespace-pre-wrap rounded-lg bg-black/30 p-4 text-sm leading-6 text-zinc-200">{summary}</pre>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </section>
  );
}

function Metric({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
      <Icon className="mb-3 text-express" size={24} />
      <p className="text-xs font-black uppercase text-zinc-500">{label}</p>
      <p className="mt-1 text-xl font-black text-carbon">{value}</p>
    </div>
  );
}
