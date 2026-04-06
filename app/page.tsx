export const dynamic = 'force-dynamic';

export default function Dashboard() {
  return (
    <div style={{ padding: '2rem', color: 'white', background: '#111', minHeight: '100vh' }}>
      <h1>🟢 Admin Panel Çalışıyor!</h1>
      <p>DATABASE_URL: {process.env.DATABASE_URL ? 'Tanımlı ✅' : 'Yok ❌'}</p>
      <p>Zaman: {new Date().toISOString()}</p>
    </div>
  );
}
