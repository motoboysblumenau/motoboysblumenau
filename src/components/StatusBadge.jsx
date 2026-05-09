const colors = {
  pendente: 'bg-amber-100 text-amber-800',
  aprovado: 'bg-emerald-100 text-emerald-800',
  reprovado: 'bg-red-100 text-red-800',
  Novo: 'bg-blue-100 text-blue-800',
  'Em análise': 'bg-amber-100 text-amber-800',
  'Motoboy solicitado': 'bg-purple-100 text-purple-800',
  'Em andamento': 'bg-cyan-100 text-cyan-800',
  Finalizado: 'bg-emerald-100 text-emerald-800',
  Cancelado: 'bg-red-100 text-red-800',
};

export default function StatusBadge({ status }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase ${colors[status] || colors.Novo}`}>
      {status}
    </span>
  );
}
