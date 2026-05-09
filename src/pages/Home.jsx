import {
  ArrowRight,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  MapPinned,
  PackageCheck,
  PackageSearch,
  Route,
  ShieldCheck,
  Sparkles,
  Truck,
  UserRoundCheck,
  Zap,
} from 'lucide-react';
import mbExpressLogo from '../assets/mb-express-logo.png';
import Button from '../components/Button';
import SectionTitle from '../components/SectionTitle';
import { companyConfig } from '../data/config';

const services = [
  { icon: MapPinned, title: 'Entregas urbanas', text: 'Coletas e entregas rápidas dentro de Blumenau com acompanhamento simples.' },
  { icon: Route, title: 'Intermunicipais', text: 'Atendimento regional em Santa Catarina e rotas sob consulta para fora do estado.' },
  { icon: CalendarClock, title: 'Coletas programadas', text: 'Agenda recorrente para empresas que precisam de previsibilidade.' },
  { icon: Zap, title: 'Entregas urgentes', text: 'Prioridade para documentos, peças, exames, produtos e demandas sensíveis.' },
  { icon: Building2, title: 'Logística para empresas', text: 'Fluxo preparado para lojas, clínicas, escritórios e operações comerciais.' },
];

const advantages = [
  'Cadastro e aprovação de motoboys pelo painel',
  'Orçamento com mapa, origem, destino e estimativa',
  'Mensagens prontas para WhatsApp e operação',
  'Estrutura preparada para bot externo e app Android',
];

const testimonials = [
  {
    name: 'Mariana K.',
    role: 'Loja de presentes',
    text: 'A MB EXPRESS deixou nossas entregas locais muito mais organizadas. O orçamento é rápido e o atendimento passa confiança.',
  },
  {
    name: 'Clínica Vale',
    role: 'Cliente empresarial',
    text: 'Precisávamos de agilidade com documentos e coletas programadas. O modelo da MB EXPRESS encaixou muito bem.',
  },
  {
    name: 'Diego R.',
    role: 'E-commerce regional',
    text: 'O visual do pedido e a mensagem pronta para WhatsApp ajudam bastante no dia a dia da operação.',
  },
];

export default function Home() {
  return (
    <>
      <section className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-carbon text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_20%,rgba(250,204,21,0.24),transparent_30%),radial-gradient(circle_at_66%_78%,rgba(225,29,47,0.25),transparent_34%),linear-gradient(135deg,#050505_0%,#111111_48%,#27070b_100%)]" />
        <div className="premium-grid absolute inset-0 opacity-40" />
        <div className="absolute -right-24 top-20 h-72 w-72 rounded-full border border-yellow-300/20" />
        <div className="absolute -bottom-28 right-20 h-80 w-80 rounded-full border border-express/30" />

        <div className="relative mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-8">
          <div className="max-w-3xl fade-up">
            <p className="mb-5 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-black uppercase text-zinc-200">
              {companyConfig.city} • Grupo {companyConfig.groupName}
            </p>
            <h1 className="max-w-3xl text-5xl font-black leading-tight sm:text-6xl lg:text-7xl">
              Entregas rápidas, seguras e inteligentes
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-200">
              A MB EXPRESS é a frente de entregas rápidas do grupo Motoboys Blumenau, conectando clientes,
              empresas e motoboys em uma experiência simples para cotar, solicitar e acompanhar entregas.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Button to="/orcamento" icon={ArrowRight}>Fazer orçamento</Button>
              <Button to="/orcamento" variant="light" icon={Truck}>Solicitar motoboy</Button>
              <Button to="/rastreio" variant="outline" icon={PackageSearch}>Rastrear pedido</Button>
              <Button to="/cadastro-motoboy" variant="outline" icon={UserRoundCheck}>Sou motoboy</Button>
            </div>
          </div>
          <div className="flex justify-center lg:justify-end">
            <img
              src={mbExpressLogo}
              alt="MB EXPRESS"
              className="w-full max-w-[360px] object-contain drop-shadow-[0_30px_70px_rgba(250,204,21,0.28)] sm:max-w-[460px] lg:max-w-[540px]"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Serviços"
            title="Entrega sob medida para a rotina de clientes e empresas"
            description="Da corrida urgente ao contrato recorrente, a estrutura foi pensada para reduzir atrito e organizar a operação."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {services.map((service) => (
              <article key={service.title} className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-panel">
                <service.icon className="mb-5 text-express" size={28} />
                <h3 className="text-lg font-black text-carbon">{service.title}</h3>
                <p className="mt-3 text-sm leading-6 text-zinc-600">{service.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-zinc-100 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <div className="rounded-lg bg-carbon p-8 text-white shadow-glow">
            <Sparkles className="mb-6 text-yellow-300" size={36} />
            <h2 className="text-3xl font-black">Sobre a MB EXPRESS</h2>
            <p className="mt-5 leading-8 text-zinc-300">
              Nascemos como uma marca de entregas rápidas dentro do grupo Motoboys Blumenau, com foco em tornar
              coletas, entregas e solicitações de motoboy mais simples, confiáveis e fáceis de organizar.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {advantages.map((item) => (
              <div key={item} className="flex gap-3 rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
                <CheckCircle2 className="shrink-0 text-express" size={22} />
                <p className="text-sm font-bold leading-6 text-zinc-800">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Vantagens"
            title="Operação preparada para crescer"
            description="O protótipo já separa cadastro, aprovação, orçamento, WhatsApp e serviços, facilitando a evolução para backend, bot e aplicativo."
            align="center"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              { icon: Clock3, title: 'Agilidade', text: 'Fluxo de orçamento direto, com distância, tempo e valor estimados.' },
              { icon: ShieldCheck, title: 'Controle', text: 'Motoboys entram como pendentes e passam por aprovação administrativa.' },
              { icon: PackageCheck, title: 'Clareza', text: 'Pedidos salvos e mensagens prontas para seguir pelo WhatsApp.' },
            ].map((item) => (
              <article key={item.title} className="rounded-lg bg-zinc-100 p-7">
                <item.icon className="mb-5 text-express" size={32} />
                <h3 className="text-xl font-black text-carbon">{item.title}</h3>
                <p className="mt-3 leading-7 text-zinc-600">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-carbon py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionTitle
            eyebrow="Depoimentos"
            title="Confiança para quem precisa entregar sem complicar"
            align="center"
            tone="dark"
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article key={testimonial.name} className="rounded-lg border border-white/10 bg-white/[0.06] p-6">
                <p className="leading-7 text-zinc-200">"{testimonial.text}"</p>
                <div className="mt-6 border-t border-white/10 pt-4">
                  <p className="font-black">{testimonial.name}</p>
                  <p className="text-sm text-zinc-400">{testimonial.role}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
