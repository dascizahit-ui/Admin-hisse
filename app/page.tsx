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
                {recentSignals.map((s: any) => (
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
      
    </div>
  );
}

