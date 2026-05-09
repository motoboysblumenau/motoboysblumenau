import { Mail, MessageCircle, MapPin } from 'lucide-react';
import SectionTitle from '../components/SectionTitle';
import { companyConfig } from '../data/config';

const sections = [
  {
    title: '1. Aceitação dos Termos',
    paragraphs: [
      'Ao realizar o cadastro na plataforma da MB EXPRESS, o entregador declara que leu, compreendeu e concorda integralmente com os presentes Termos de Uso e Cadastro.',
      'O uso da plataforma implica na aceitação total destes termos.',
    ],
  },
  {
    title: '2. Objetivo da Plataforma',
    paragraphs: [
      'A MB EXPRESS atua exclusivamente como plataforma de intermediação logística entre empresas, clientes e entregadores parceiros (“motoboys”).',
      'A plataforma tem como finalidade conectar empresas e entregadores, facilitar solicitações de entregas e disponibilizar sistema de gestão e comunicação logística.',
      'A MB EXPRESS não realiza transporte diretamente e não participa da execução física das entregas.',
    ],
  },
  {
    title: '3. Natureza da Relação',
    paragraphs: [
      'A MB EXPRESS atua apenas como intermediadora tecnológica e operacional.',
      'Não existe vínculo empregatício, trabalhista, societário ou previdenciário entre a MB EXPRESS e os entregadores cadastrados.',
      'Os entregadores atuam de forma totalmente autônoma e independente.',
    ],
  },
  {
    title: '4. Pagamentos e Responsabilidades Financeiras',
    paragraphs: [
      'A MB EXPRESS não realiza pagamentos diretos aos motoboys pelas entregas realizadas.',
      'Os valores, negociações, formas de pagamento, repasses e condições financeiras são definidos exclusivamente entre empresa contratante, cliente e entregador parceiro.',
      'A MB EXPRESS não se responsabiliza por inadimplência, atrasos em pagamentos, cobranças, negociações particulares ou acordos financeiros realizados entre as partes.',
    ],
  },
  {
    title: '5. Requisitos para Cadastro',
    paragraphs: [
      'Para utilizar a plataforma como entregador parceiro, o usuário deverá ser maior de 18 anos, possuir CNH válida, possuir motocicleta regularizada, fornecer dados verdadeiros, cumprir a legislação vigente e manter documentação atualizada.',
      'A plataforma poderá solicitar documentos comprobatórios para validação do cadastro.',
    ],
  },
  {
    title: '6. Aprovação e Análise de Cadastro',
    paragraphs: [
      'Os cadastros passarão por análise interna.',
      'A MB EXPRESS poderá aprovar, recusar, suspender ou cancelar qualquer cadastro a qualquer momento por motivos de segurança, irregularidade ou descumprimento destes termos.',
    ],
  },
  {
    title: '7. Responsabilidades do Entregador',
    paragraphs: [
      'O entregador parceiro é integralmente responsável por sua condução, motocicleta, documentação, tributos, combustível, manutenção, equipamentos de segurança e cumprimento das leis de trânsito.',
      'O entregador compromete-se a agir com respeito e profissionalismo, não praticar atividades ilícitas e manter conduta adequada junto aos clientes e empresas.',
    ],
  },
  {
    title: '8. Uso Indevido da Plataforma',
    paragraphs: [
      'É proibido utilizar informações falsas, compartilhar contas, praticar fraudes, utilizar sistemas automatizados indevidos ou causar prejuízo à plataforma, empresas ou terceiros.',
      'O descumprimento poderá resultar em suspensão, bloqueio definitivo, exclusão da conta e medidas judiciais cabíveis.',
    ],
  },
  {
    title: '9. Privacidade e Dados',
    paragraphs: [
      'Os dados fornecidos poderão ser utilizados para validação cadastral, segurança, comunicação, funcionamento da plataforma e melhoria dos serviços.',
      'A MB EXPRESS compromete-se a respeitar a legislação aplicável, incluindo a LGPD.',
    ],
  },
  {
    title: '10. Limitação de Responsabilidade',
    paragraphs: [
      'A MB EXPRESS não se responsabiliza por acidentes, perdas, danos, extravios, negociações financeiras, conflitos entre empresas e entregadores, execução das entregas ou condutas individuais dos usuários.',
      'A responsabilidade pela prestação do serviço de entrega é exclusivamente do entregador parceiro contratado.',
    ],
  },
  {
    title: '11. Alterações dos Termos',
    paragraphs: [
      'A MB EXPRESS poderá alterar estes termos a qualquer momento sem aviso prévio, sendo responsabilidade do usuário consultar periodicamente a versão atualizada.',
    ],
  },
];

export default function Terms() {
  return (
    <section className="bg-zinc-100 py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Termos"
          title="Termos de Cadastro de Motoboy – MB EXPRESS"
          description="Condições para cadastro, análise e uso da plataforma por entregadores parceiros."
        />

        <div className="mt-8 rounded-lg border border-zinc-200 bg-white p-5 shadow-panel sm:p-8">
          <div className="rounded-lg bg-carbon p-5 text-white">
            <p className="text-xs font-black uppercase text-yellow-300">Importante</p>
            <p className="mt-2 text-sm leading-7 text-zinc-200">
              Ao realizar o cadastro, o entregador declara ciência de que a MB EXPRESS atua como plataforma
              de intermediação logística, sem vínculo empregatício e sem pagamento direto aos motoboys.
            </p>
          </div>

          <div className="mt-8 space-y-8">
            {sections.map((section) => (
              <article key={section.title} className="border-b border-zinc-200 pb-7 last:border-b-0 last:pb-0">
                <h2 className="text-xl font-black text-carbon">{section.title}</h2>
                <div className="mt-3 space-y-3 text-sm leading-7 text-zinc-700">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ))}

            <article className="rounded-lg border border-zinc-200 bg-zinc-50 p-5">
              <h2 className="text-xl font-black text-carbon">12. Contato</h2>
              <div className="mt-4 grid gap-3 text-sm font-bold text-zinc-700 sm:grid-cols-3">
                <a className="flex items-center gap-2 text-blue-700 hover:text-blue-900" href={`mailto:${companyConfig.email}`}>
                  <Mail size={18} /> {companyConfig.email}
                </a>
                <a className="flex items-center gap-2 text-blue-700 hover:text-blue-900" href="https://wa.me/5547992524104" target="_blank" rel="noreferrer">
                  <MessageCircle size={18} /> (47) 99252-4104
                </a>
                <span className="flex items-center gap-2">
                  <MapPin size={18} /> Blumenau
                </span>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
