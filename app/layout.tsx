import './globals.css';
import { Inter, Outfit } from 'next/font/google';
import Link from 'next/link';
import { LayoutDashboard, Users, TrendingUp, AlertTriangle, Settings, ShieldAlert } from 'lucide-react';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata = {
  title: 'Hisse Bot Admin | Premium Control',
  description: 'Control center for the Stock Analysis Telegram Bot',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={outfit.className}>
        <div className="sidebar glass-panel">
          <div style={{ marginBottom: '3rem', fontSize: '1.5rem', fontWeight: 700, background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Hisse Bot Admin
          </div>
          <nav>
            <Link href="/" className="nav-link">
              <LayoutDashboard size={20} /> Dashboard
            </Link>
            <Link href="/users" className="nav-link">
              <Users size={20} /> Kullanıcılar
            </Link>
            <Link href="/signals" className="nav-link">
              <TrendingUp size={20} /> Son Sinyaller
            </Link>
            <Link href="/reports" className="nav-link">
              <AlertTriangle size={20} /> Raporlar
            </Link>
            <Link href="/bans" className="nav-link">
              <ShieldAlert size={20} /> Yasaklılar
            </Link>
          </nav>
          
          <div style={{ position: 'absolute', bottom: '2rem', left: '1.5rem' }}>
            <Link href="/settings" className="nav-link">
              <Settings size={20} /> Ayarlar
            </Link>
          </div>
        </div>
        <main className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}
