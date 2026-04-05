export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  let userCount = 0;
  let banCount = 0;
  let signalCount = 0;
  let reportCount = 0;
  let recentSignals: any[] = [];
  let dbError = '';

  try {
    const prisma = (await import('@/lib/prisma')).default;
    userCount = await prisma.user.count();
    banCount = await prisma.ban.count();
    signalCount = await prisma.hourlySignal.count();
    reportCount = await prisma.report.count({ where: { status: 'pending' } });
    recentSignals = await prisma.hourlySignal.findMany({
      take: 5,
      orderBy: { created_at: 'desc' }
    });
  } catch (e: any) {
    dbError = e.message || 'Veritabanı bağlantı hatası';
    console.error('Dashboard DB Error:', e);
  }

  return (
    <div>
      <h1 className="header-gradient" style={{ fontSize: '2.5rem', marginBottom: '2rem', fontWeight: 800 }}>Dashboard</h1>
      
      {dbError && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444', borderRadius: '12px', padding: '1rem', marginBottom: '2rem', color: '#ef4444' }}>
          ⚠️ Veritabanı Hatası: {dbError}
        </div>
      )}

      <div className="stat-grid">
        <div className="card glass-panel flex-row">
          <div><span className="icon-blue" style={{fontSize: '1.5rem'}}>👥</span></div>
          <div>
            <span className="stat-label">Toplam Kullanıcı</span>
            <div className="stat-value">{userCount}</div>
          </div>
        </div>
        
        <div className="card glass-panel flex-row">
          <div><span className="icon-green" style={{fontSize: '1.5rem'}}>📊</span></div>
          <div>
            <span className="stat-label">Toplam Sinyal Analizi</span>
            <div className="stat-value">{signalCount}</div>
          </div>
        </div>

        <div className="card glass-panel flex-row">
          <div><span className="icon-red" style={{fontSize: '1.5rem'}}>🚫</span></div>
          <div>
            <span className="stat-label">Yasaklı Kullanıcı</span>
            <div className="stat-value">{banCount}</div>
          </div>
        </div>

        <div className="card glass-panel flex-row">
          <div><span className="icon-yellow" style={{fontSize: '1.5rem'}}>⚠️</span></div>
          <div>
            <span className="stat-label">Bekleyen Rapor</span>
            <div className="stat-value">{reportCount}</div>
          </div>
        </div>
      </div>

      <div className="card-container two-columns">
        <div className="card glass-panel">
          <div className="card-header">
            <span style={{fontSize: '1.2rem'}}>📈</span>
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
                {recentSignals.length === 0 && (
                  <tr><td colSpan={5} style={{opacity: 0.5, textAlign: 'center'}}>Henüz sinyal yok</td></tr>
                )}
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
            <span style={{fontSize: '1.2rem'}}>📊</span>
            <h2>Sistem Durumu</h2>
          </div>
          <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
             <div className="system-item">
                <div className="system-label">Bot Polling Durumu</div>
                <div className="system-status online">AKTİF</div>
             </div>
             <div className="system-item">
                <div className="system-label">Veritabanı</div>
                <div className={`system-status ${dbError ? 'neutral' : 'online'}`}>{dbError ? 'HATA' : 'BAĞLI'}</div>
             </div>
             <div className="system-item">
                <div className="system-label">Toplam Kullanıcı</div>
                <div className="system-status fast">{userCount}</div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
