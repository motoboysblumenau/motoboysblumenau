import Button from '../components/Button';

export default function NotFound() {
  return (
    <section className="grid min-h-[55vh] place-items-center bg-white px-4 py-16 text-center">
      <div>
        <p className="text-sm font-black uppercase text-express">404</p>
        <h1 className="mt-3 text-4xl font-black text-carbon">Página não encontrada</h1>
        <p className="mt-4 text-zinc-600">A rota que você tentou acessar não existe neste protótipo.</p>
        <Button to="/" className="mt-7">Voltar ao início</Button>
      </div>
    </section>
  );
}
