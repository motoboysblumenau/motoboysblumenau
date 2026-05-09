import { Instagram, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import mbExpressLogo from '../assets/mb-express-logo.png';
import motoboysLogo from '../assets/motoboys-blumenau-logo.png';
import { companyConfig } from '../data/config';
import { createWhatsappLink } from '../services/whatsappService';

export default function Footer() {
  return (
    <footer className="bg-carbon text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.2fr_1fr_1fr] lg:px-8">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <img src={mbExpressLogo} alt="MB EXPRESS" className="h-12 w-20 rounded-lg bg-black object-contain" />
            <div>
              <p className="font-black">{companyConfig.name}</p>
              <p className="text-sm text-zinc-400">Marca de entregas do grupo {companyConfig.groupName}</p>
            </div>
          </div>
          <p className="max-w-md text-sm leading-6 text-zinc-400">{companyConfig.serviceArea}.</p>
          <div className="mt-5 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <img src={motoboysLogo} alt="Motoboys Blumenau" className="h-12 w-12 rounded-full object-cover" />
            <p className="text-xs font-bold uppercase text-yellow-300">Operação integrada ao grupo Motoboys Blumenau</p>
          </div>
        </div>
        <div>
          <p className="mb-4 text-sm font-black uppercase text-zinc-400">Navegação</p>
          <div className="grid gap-3 text-sm font-semibold">
            <Link to="/orcamento" className="hover:text-yellow-300">Fazer orçamento</Link>
            <Link to="/rastreio" className="hover:text-yellow-300">Rastrear pedido</Link>
            <Link to="/cadastro-motoboy" className="hover:text-yellow-300">Cadastro de motoboy</Link>
            <Link to="/admin/login" className="hover:text-yellow-300">Painel administrativo</Link>
            <Link to="/termos" className="hover:text-yellow-300">Termos</Link>
          </div>
        </div>
        <div>
          <p className="mb-4 text-sm font-black uppercase text-zinc-400">Contato</p>
          <div className="grid gap-3 text-sm font-semibold">
            <a className="flex items-center gap-2 hover:text-yellow-300" href={createWhatsappLink('Olá, MB EXPRESS!')}>
              <MessageCircle size={17} /> WhatsApp
            </a>
            <a className="flex items-center gap-2 hover:text-yellow-300" href={companyConfig.instagramUrl}>
              <Instagram size={17} /> {companyConfig.instagram}
            </a>
            <a className="flex items-center gap-2 hover:text-yellow-300" href={`mailto:${companyConfig.email}`}>
              <Mail size={17} /> {companyConfig.email}
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-white/10 px-4 py-5 text-center text-xs text-zinc-500">
        © 2026 MB EXPRESS. Uma marca do grupo Motoboys Blumenau.
      </div>
    </footer>
  );
}
