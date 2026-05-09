import { Menu, ShieldCheck, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import mbExpressLogo from '../assets/mb-express-logo.png';
import { companyConfig } from '../data/config';
import Button from './Button';

const links = [
  { to: '/', label: 'Início' },
  { to: '/orcamento', label: 'Orçamento' },
  { to: '/rastreio', label: 'Rastrear' },
  { to: '/cadastro-motoboy', label: 'Sou motoboy' },
  { to: '/termos', label: 'Termos' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-[1000] border-b border-yellow-300/15 bg-black shadow-2xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavLink to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img
            src={mbExpressLogo}
            alt="MB EXPRESS"
            className="h-12 w-20 rounded-lg bg-black object-contain ring-1 ring-yellow-300/35"
          />
          <span>
            <span className="block text-lg font-black leading-none text-white">{companyConfig.name}</span>
            <span className="text-xs font-semibold uppercase text-yellow-300">Grupo {companyConfig.groupName}</span>
          </span>
        </NavLink>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-sm font-bold transition ${
                  isActive ? 'bg-yellow-300 text-black' : 'text-zinc-200 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Button to="/admin/login" variant="outline" icon={ShieldCheck} className="px-4">
            Admin
          </Button>
          <Button to="/orcamento">Fazer orçamento</Button>
        </div>

        <button
          className="grid h-11 w-11 place-items-center rounded-lg bg-white/10 text-white lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-label="Abrir menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-white/10 bg-black px-4 pb-5 lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-2 pt-4">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-3 text-sm font-bold ${
                    isActive ? 'bg-yellow-300 text-black' : 'bg-white/5 text-zinc-200'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Button to="/admin/login" variant="outline" icon={ShieldCheck} onClick={() => setOpen(false)}>
              Admin
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
