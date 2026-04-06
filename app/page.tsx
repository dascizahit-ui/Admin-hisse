export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  let userCount = 0;
  let banCount = 0;
  let dbStatus = '⏳';
  let dbError = '';

  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    userCount = await prisma.user.count();
    banCount = await prisma.ban.count();
    dbStatus = '✅ Bağlı';
    await prisma.$disconnect();
  } catch (e: any) {
    dbError = String(e?.message || e);
    dbStatus = '❌ Hata';
  }

  return (
    <div style={{ padding: '2rem', color: 'white', background: 'linear-gradient(135deg, #0f172a, #1e1b4b)', minHeight: '100vh', fontFamily: 'system-ui' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '2rem', background: 'linear-gradient(to right, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
        🤖 Hisse Bot Admin
      </h1>

      {dbError && (
        <div style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem', color: '#fca5a5', fontSize: '0.85rem' }}>
          ⚠️ DB Hatası: {dbError}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '0.85rem', opacity: 0.5, marginBottom: '0.5rem' }}>👥 Kullanıcılar</div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{userCount}</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '0.85rem', opacity: 0.5, marginBottom: '0.5rem' }}>🚫 Yasaklı</div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{banCount}</div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ fontSize: '0.85rem', opacity: 0.5, marginBottom: '0.5rem' }}>🔌 Veritabanı</div>
          <div style={{ fontSize: '2rem', fontWeight: 700 }}>{dbStatus}</div>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '16px', padding: '1.5rem', border: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>📊 Sistem Durumu</h2>
        <p style={{ opacity: 0.6, lineHeight: 2 }}>
          ✅ Bot: Çalışıyor<br/>
          ✅ Admin Panel: Çalışıyor<br/>
          {dbError ? '❌' : '✅'} Veritabanı: {dbStatus}<br/>
          ✅ DATABASE_URL: {process.env.DATABASE_URL ? 'Tanımlı' : 'Tanımlı değil'}
        </p>
      </div>
    </div>
  );
}
