export default function SectionTitle({ eyebrow, title, description, align = 'left', tone = 'light' }) {
  const titleColor = tone === 'dark' ? 'text-white' : 'text-carbon';
  const descriptionColor = tone === 'dark' ? 'text-zinc-300' : 'text-zinc-600';

  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-black uppercase text-express">{eyebrow}</p>
      ) : null}
      <h2 className={`text-3xl font-black leading-tight sm:text-4xl ${titleColor}`}>{title}</h2>
      {description ? <p className={`mt-4 text-base leading-7 ${descriptionColor}`}>{description}</p> : null}
    </div>
  );
}
