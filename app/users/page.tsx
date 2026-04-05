import prisma from '@/lib/prisma';
import { User, ShieldAlert, ShieldCheck, Mail, Activity, Ban, MessageSquareOff } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    include: {
      bans: true,
      mutes: true,
      settings: true
    },
    orderBy: { created_at: 'desc' }
  });

  async function toggleBan(userId: bigint, currentlyBanned: boolean) {
    'use server';
    if (currentlyBanned) {
      await prisma.ban.delete({ where: { user_id: userId } });
    } else {
      await prisma.ban.create({ data: { user_id: userId, reason: 'Yönetici tarafından yasaklandı' } });
    }
    revalidatePath('/users');
  }

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: 800 }}>Kullanıcı Yönetimi</h1>
      
      <div className="card glass-panel">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Kullanıcı</th>
                <th>Telegram ID</th>
                <th>Durum</th>
                <th>Dil / Saat Dilimi</th>
                <th>Son Aktivite</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u: any) => {
                const isBanned = !!u.bans;
                const isMuted = !!u.mutes;
                
                return (
                  <tr key={u.user_id.toString()}>
                    <td>
                      <div className="user-info">
                        <div className="user-avatar">{u.username?.[0]?.toUpperCase() || '?'}</div>
                        <div>
                          <div className="user-name">{u.username || 'İsimsiz'}</div>
                          <div className="user-date">Kayıt: {u.created_at?.toLocaleDateString()}</div>
                        </div>
                      </div>
                    </td>
                    <td><code>{u.user_id.toString()}</code></td>
                    <td>
                      {isBanned ? (
                        <span className="status-badge status-banned">YASAKLI</span>
                      ) : (
                        <span className="status-badge status-active">AKTİF</span>
                      )}
                    </td>
                    <td style={{ opacity: 0.6 }}>{u.settings?.preferred_language || 'TR'} / {u.settings?.timezone || 'TR'}</td>
                    <td style={{ opacity: 0.6 }}>{u.last_active?.toLocaleString() || '-'}</td>
                    <td>
                        <div className="action-row">
                          <form action={toggleBan.bind(null, u.user_id, isBanned)}>
                            <button className={isBanned ? 'btn-primary' : 'btn-outline'}>
                              {isBanned ? <ShieldCheck size={16} /> : <Ban size={16} />}
                            </button>
                          </form>
                          <button className="btn-outline"><MessageSquareOff size={16} /></button>
                        </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

