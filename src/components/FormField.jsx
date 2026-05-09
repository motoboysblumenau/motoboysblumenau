export default function FormField({
  label,
  error,
  children,
  hint,
  className = '',
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-sm font-bold text-zinc-800">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-zinc-500">{hint}</span> : null}
      {error ? <span className="mt-1 block text-xs font-semibold text-express">{error}</span> : null}
    </label>
  );
}

export const inputClass =
  'min-h-12 w-full rounded-lg border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-express focus:ring-4 focus:ring-red-100';
