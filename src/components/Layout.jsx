import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Header from './Header';
import WhatsAppFloat from './WhatsAppFloat';

export default function Layout() {
  return (
    <div className="min-h-screen bg-zinc-100">
      <Header />
      <main className="pt-20">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}
