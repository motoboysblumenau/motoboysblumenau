import { LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import FormField, { inputClass } from '../components/FormField';
import SectionTitle from '../components/SectionTitle';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  function submit(event) {
    event.preventDefault();
    const ok = login(credentials.username, credentials.password);
    if (!ok) {
      setError('Usuário ou senha inválidos.');
      return;
    }
    navigate(location.state?.from?.pathname || '/admin', { replace: true });
  }

  return (
    <section className="grid min-h-[70vh] place-items-center bg-zinc-100 px-4 py-16">
      <div className="w-full max-w-md rounded-lg border border-zinc-200 bg-white p-6 shadow-panel sm:p-8">
        <div className="mb-6 grid h-14 w-14 place-items-center rounded-lg bg-carbon text-white">
          <LockKeyhole size={26} />
        </div>
        <SectionTitle eyebrow="Admin" title="Acesso administrativo" description="Entre para aprovar motoboys e acompanhar solicitações." />
        <form className="mt-8 space-y-5" onSubmit={submit}>
          <FormField label="Usuário">
            <input
              className={inputClass}
              value={credentials.username}
              onChange={(event) => setCredentials((current) => ({ ...current, username: event.target.value }))}
              autoComplete="username"
            />
          </FormField>
          <FormField label="Senha">
            <input
              className={inputClass}
              type="password"
              value={credentials.password}
              onChange={(event) => setCredentials((current) => ({ ...current, password: event.target.value }))}
              autoComplete="current-password"
            />
          </FormField>
          {error ? <p className="rounded-lg bg-red-50 p-3 text-sm font-bold text-express">{error}</p> : null}
          <Button type="submit" className="w-full">Entrar</Button>
        </form>
        <p className="mt-5 text-xs leading-5 text-zinc-500">
          Login de protótipo em localStorage. Para produção real, use autenticação segura no backend.
        </p>
      </div>
    </section>
  );
}
