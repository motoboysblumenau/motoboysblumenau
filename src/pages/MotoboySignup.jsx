import { CheckCircle2, Send } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import FormField, { inputClass } from '../components/FormField';
import SectionTitle from '../components/SectionTitle';
import { formatDate, formatPhone } from '../utils/formatters';
import { addMotoboy } from '../utils/storage';
import { hasErrors, requiredFields } from '../utils/validation';

const initialForm = {
  name: '',
  birthDate: '',
  phone: '',
  city: 'Blumenau',
  hasBox: 'Sim',
  hasMei: 'Sim',
  acceptedTerms: false,
};

export default function MotoboySignup() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [sent, setSent] = useState(false);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function submit(event) {
    event.preventDefault();
    const nextErrors = requiredFields(form, {
      name: 'Nome completo',
      birthDate: 'Data de nascimento',
      phone: 'Telefone/WhatsApp',
      city: 'Cidade',
    });
    if (!form.acceptedTerms) {
      nextErrors.acceptedTerms = 'É necessário aceitar os termos.';
    }
    setErrors(nextErrors);
    if (hasErrors(nextErrors)) return;

    addMotoboy({
      ...form,
      hasBox: form.hasBox === 'Sim',
      hasMei: form.hasMei === 'Sim',
      status: 'pendente',
      acceptedTerms: true,
    });
    setSent(true);
    setForm(initialForm);
  }

  return (
    <section className="bg-zinc-100 py-16">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8">
        <div>
          <SectionTitle
            eyebrow="Cadastro"
            title="Faça parte da operação MB EXPRESS"
            description="Cadastre seus dados para análise administrativa. O status inicial será pendente até a aprovação pelo painel."
          />
          <div className="mt-8 rounded-lg bg-carbon p-6 text-white">
            <h3 className="text-xl font-black">Como funciona</h3>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-zinc-300">
              <li className="flex gap-3"><CheckCircle2 className="shrink-0 text-express" size={20} /> Envie seus dados completos.</li>
              <li className="flex gap-3"><CheckCircle2 className="shrink-0 text-express" size={20} /> A administração avalia o cadastro.</li>
              <li className="flex gap-3"><CheckCircle2 className="shrink-0 text-express" size={20} /> Após aprovação, o motoboy fica disponível para a operação futura.</li>
            </ul>
          </div>
        </div>

        <form className="rounded-lg border border-zinc-200 bg-white p-5 shadow-panel sm:p-7" onSubmit={submit}>
          {sent ? (
            <div className="mb-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800">
              Cadastro enviado para análise.
            </div>
          ) : null}
          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Nome completo" error={errors.name}>
              <input className={inputClass} value={form.name} onChange={(event) => update('name', event.target.value)} />
            </FormField>
            <FormField label="Data de nascimento" error={errors.birthDate}>
              <input
                className={inputClass}
                value={form.birthDate}
                onChange={(event) => update('birthDate', formatDate(event.target.value))}
                placeholder="dd/mm/aaaa"
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
            <FormField label="Cidade" error={errors.city}>
              <input className={inputClass} value={form.city} onChange={(event) => update('city', event.target.value)} />
            </FormField>
            <FormField label="Possui baú?">
              <select className={inputClass} value={form.hasBox} onChange={(event) => update('hasBox', event.target.value)}>
                <option>Sim</option>
                <option>Não</option>
              </select>
            </FormField>
            <FormField label="Possui MEI?">
              <select className={inputClass} value={form.hasMei} onChange={(event) => update('hasMei', event.target.value)}>
                <option>Sim</option>
                <option>Não</option>
              </select>
            </FormField>
            <label className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50 p-4 md:col-span-2">
              <input
                type="checkbox"
                checked={form.acceptedTerms}
                onChange={(event) => update('acceptedTerms', event.target.checked)}
                className="mt-1 h-5 w-5 accent-blue-600"
              />
              <span className="text-sm leading-6 text-zinc-700">
                <strong className="block text-carbon">Aceito os termos</strong>
                Declaro que li e concordo com os{' '}
                <Link to="/termos" target="_blank" className="font-black text-blue-700 underline decoration-blue-300 underline-offset-4 hover:text-blue-900">
                  Termos de Cadastro de Motoboy – MB EXPRESS
                </Link>
                , incluindo a ciência de que atuo como entregador parceiro autônomo e que meus dados serão usados para análise e contato.
                {errors.acceptedTerms ? <strong className="block text-express">{errors.acceptedTerms}</strong> : null}
              </span>
            </label>
          </div>
          <Button type="submit" icon={Send} className="mt-6 w-full sm:w-auto">
            Enviar cadastro
          </Button>
        </form>
      </div>
    </section>
  );
}
