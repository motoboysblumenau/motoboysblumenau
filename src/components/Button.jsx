import { Link } from 'react-router-dom';

const variants = {
  primary: 'bg-express text-white shadow-glow hover:bg-ember',
  dark: 'bg-carbon text-white hover:bg-graphite',
  light: 'bg-white text-carbon hover:bg-zinc-100',
  outline: 'border border-white/25 bg-white/10 text-white hover:bg-white/20',
  ghost: 'text-carbon hover:bg-zinc-100',
};

export default function Button({
  children,
  to,
  href,
  variant = 'primary',
  className = '',
  icon: Icon,
  ...props
}) {
  const classes = `inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-express focus:ring-offset-2 ${variants[variant]} ${className}`;
  const content = (
    <>
      {Icon ? <Icon size={18} aria-hidden="true" /> : null}
      <span>{children}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={classes} target="_blank" rel="noreferrer">
        {content}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {content}
    </button>
  );
}
