import { MessageCircle } from 'lucide-react';
import { createWhatsappLink } from '../services/whatsappService';

export default function WhatsAppFloat() {
  return (
    <a
      href={createWhatsappLink('Olá, MB EXPRESS! Preciso de uma entrega.')}
      target="_blank"
      rel="noreferrer"
      aria-label="Falar com a MB EXPRESS pelo WhatsApp"
      className="fixed bottom-5 right-5 z-[1100] grid h-14 w-14 place-items-center rounded-full bg-emerald-500 text-white shadow-2xl transition hover:-translate-y-1 hover:bg-emerald-400"
    >
      <MessageCircle size={27} />
    </a>
  );
}
