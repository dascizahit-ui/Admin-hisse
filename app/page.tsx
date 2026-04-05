export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  let userCount = 0;
  let banCount = 0;
  let dbStatus = 'Bağlanıyor...';
  let dbError = '';

  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    userCount = await prisma.user.count();
    banCount = await prisma.ban.count();
    dbStatus = 'Bağlı ✅';
    await prisma.$disconnect();
  } catch (e: any) {
    dbError = String(e?.message || e);
    dbStatus = 'Hata ❌';
    console.error('DB Error:', dbError);
  }

  return (
    <div>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', fontWeight: 800, background: 'linear-gradient(to right, #fff, #9ca3af)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        Hisse Bot Admin
      </h1>

      {dbError && (
        <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', color: '#fca5a5', fontSize: '0.9rem', wordBreak: 'break-all' }}>
          <strong>⚠️ Veritabanı Hatası:</strong><br/>{dbError}
        </div>
      )}

      <div className="stat-grid">
        <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ fontSize: '2rem' }}>👥</div>
          <div>
            <div style={{ fontSize: '0.85rem', opacity: 0.5 }}>Kullanıcı</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{userCount}</div>
          </div>
        </div>
        <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ fontSize: '2rem' }}>🚫</div>
          <div>
            <div style={{ fontSize: '0.85rem', opacity: 0.5 }}>Yasaklı</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{banCount}</div>
          </div>
        </div>
        <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ fontSize: '2rem' }}>🔌</div>
          <div>
            <div style={{ fontSize: '0.85rem', opacity: 0.5 }}>Veritabanı</div>
            <div style={{ fontSize: '1.75rem', fontWeight: 700 }}>{dbStatus}</div>
          </div>
        </div>
      </div>

      <div className="card glass-panel" style={{ marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>🤖 Sistem Bilgisi</h2>
        <p style={{ opacity: 0.6 }}>Bot ve Admin Paneli Railway üzerinde çalışıyor.</p>
        <p style={{ opacity: 0.6, marginTop: '0.5rem' }}>DATABASE_URL: {process.env.DATABASE_URL ? '✅ Tanımlı' : '❌ Tanımlı değil'}</p>
      </div>
    </div>
  );
}
