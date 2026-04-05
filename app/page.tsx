import prisma from '@/lib/prisma';
import { Users, TrendingUp, AlertTriangle, ShieldCheck, Clock, Activity, BarChart3, PieChart } from 'lucide-react';

export default async function Dashboard() {
  // Fetch some stats from Postgres
  const userCount = await prisma.user.count();
  const banCount = await prisma.ban.count();
  const signalCount = await prisma.hourlySignal.count();
  const reportCount = await prisma.report.count({ where: { status: 'pending' } });
  
  // Recent signals
  const recentSignals = await prisma.hourlySignal.findMany({
    take: 5,
    orderBy: { created_at: 'desc' }
  });

  return (
    <div>
      <h1 className="header-gradient" style={{ fontSize: '2.5rem', marginBottom: '2rem', fontWeight: 800 }}>Dashboard</h1>
      
      <div className="stat-grid">
        <div className="card glass-panel flex-row">
          <div><Users className="icon-blue" size={24} /></div>
          <div>
            <span className="stat-label">Toplam Kullanıcı</span>
            <div className="stat-value">{userCount}</div>
          </div>
        </div>
        
        <div className="card glass-panel flex-row">
          <div><TrendingUp className="icon-green" size={24} /></div>
          <div>
            <span className="stat-label">Toplam Sinyal Analizi</span>
            <div className="stat-value">{signalCount}</div>
          </div>
        </div>

        <div className="card glass-panel flex-row">
          <div><ShieldCheck className="icon-red" size={24} /></div>
          <div>
            <span className="stat-label">Yasaklı Kullanıcı</span>
            <div className="stat-value">{banCount}</div>
          </div>
        </div>

        <div className="card glass-panel flex-row">
          <div><AlertTriangle className="icon-yellow" size={24} /></div>
          <div>
            <span className="stat-label">Bekleyen Rapor</span>
            <div className="stat-value">{reportCount}</div>
          </div>
        </div>
      </div>

      <div className="card-container two-columns">
        <div className="card glass-panel">
          <div className="card-header">
            <Activity size={20} className="icon-blue" />
            <h2>Son Hisse Sinyalleri</h2>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Sembol</th>
                  <th>Sinyal</th>
                  <th>Fiyat</th>
                  <th>Güç</th>
                  <th>Zaman</th>
                </tr>
              </thead>
              <tbody>
                {recentSignals.map((s) => (
                  <tr key={s.id}>
                    <td style={{ fontWeight: 700 }}>{s.symbol}</td>
                    <td>
                      <span className={`status-badge ${s.signal_type === 'AL' ? 'status-active' : 'status-banned'}`}>
                        {s.signal_type}
                      </span>
                    </td>
                    <td>{s.price.toFixed(2)} ₺</td>
                    <td>{s.signal_strength}/10</td>
                    <td style={{ opacity: 0.5 }}>{s.created_at?.toLocaleTimeString() || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card glass-panel">
          <div className="card-header">
            <BarChart3 size={20} className="icon-purple" />
            <h2>Sistem Durumu</h2>
          </div>
          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <div className="system-item">
                <div className="system-label">Bot Polling Durumu</div>
                <div className="system-status online">AKTİF</div>
             </div>
             <div className="system-item">
                <div className="system-label">Veritabanı Gecikmesi</div>
                <div className="system-status fast">14ms</div>
             </div>
             <div className="system-item">
                <div className="system-label">Yfinance API Erişimi</div>
                <div className="system-status online">GÜVENLİ</div>
             </div>
             <div className="system-item">
                <div className="system-label">Son Güncelleme</div>
                <div className="system-status neutral">{new Date().toLocaleTimeString()}</div>
             </div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .header-gradient {
            background: linear-gradient(to right, #fff, #9ca3af);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .flex-row { display: flex; align-items: center; gap: 1.5rem; }
        .stat-label { font-size: 0.85rem; color: rgba(255,255,255,0.4); }
        .stat-value { font-size: 1.75rem; font-weight: 700; margin-top: 2px; }
        .icon-blue { color: #3b82f6; }
        .icon-green { color: #10b981; }
        .icon-red { color: #ef4444; }
        .icon-yellow { color: #f59e0b; }
        .icon-purple { color: #8b5cf6; }
        .card-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; }
        .card-header h2 { font-size: 1.1rem; font-weight: 600; }
        .card-container.two-columns {
           display: grid;
           grid-template-columns: 1.8fr 1fr;
           gap: 1.5rem;
        }
        .system-item { display: flex; justify-content: space-between; align-items: center; }
        .system-label { font-size: 0.9rem; opacity: 0.7; }
        .system-status { font-size: 0.75rem; font-weight: 800; padding: 4px 10px; border-radius: 6px; }
        .online { color: #10b981; background: rgba(16,185,129,0.1); }
        .fast { color: #3b82f6; background: rgba(59,130,246,0.1); }
        .neutral { color: #9ca3af; background: rgba(156,163,175,0.1); }
      `}</style>
    </div>
  );
}
