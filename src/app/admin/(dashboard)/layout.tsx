'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Droplets, BarChart3, PlusCircle, Wrench, AlertTriangle, LogOut, MapPin } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [admin, setAdmin] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('aquatrack_admin');
    if (!stored) { router.push('/admin/login'); return; }
    setAdmin(JSON.parse(stored));
  }, [router]);

  if (!admin) return null;

  const links = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: BarChart3 },
    { href: '/admin/data-entry', label: 'Log Water Data', icon: PlusCircle },
    { href: '/admin/manage-data', label: 'Manage Records', icon: Droplets },
    { href: '/admin/areas', label: 'Manage Areas', icon: MapPin },
    { href: '/admin/plumbers', label: 'Plumber Approvals', icon: Wrench },
    { href: '/admin/leak-reports', label: 'Leak Reports', icon: AlertTriangle },
  ];

  const logout = () => { localStorage.removeItem('aquatrack_admin'); router.push('/admin/login'); };

  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div style={{ padding: '0 1.25rem 1.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--primary-light)', fontWeight: 700 }}>
            <Droplets size={20} /> AquaTrack
          </Link>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Welcome, {admin.name}</p>
        </div>
        <ul className="sidebar-nav">
          {links.map(link => (
            <li key={link.href}>
              <Link href={link.href} className={pathname === link.href ? 'active' : ''}>
                <link.icon size={18} /> {link.label}
              </Link>
            </li>
          ))}
          <li style={{ marginTop: '2rem' }}>
            <button onClick={logout} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-family)', fontSize: '0.9rem', width: '100%', borderRadius: 'var(--radius-sm)' }}>
              <LogOut size={18} /> Sign Out
            </button>
          </li>
        </ul>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}
