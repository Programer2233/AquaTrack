'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Droplets, Menu, X, ShieldCheck, Search, ShoppingBag } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Don't render the public navbar on admin pages
  if (pathname.startsWith('/admin')) return null;

  const links = [
    { href: '/', label: 'HOME' },
    { href: '/conservation', label: 'CONSERVATION' },
    { href: '/plumbers', label: 'PLUMBERS' },
    { href: '/calculator', label: 'CALCULATOR' },
    { href: '/report-leak', label: 'REPORT LEAK' },
  ];

  return (
    <nav className="navbar" style={{ borderBottom: 'none', background: 'transparent' }}>
      <Link href="/" className="navbar-brand">
        AQUATRACK.
      </Link>

      <ul className="navbar-links" style={mobileOpen ? {
        display: 'flex',
        flexDirection: 'column',
        position: 'absolute',
        top: '72px',
        left: 0,
        right: 0,
        background: 'rgba(5, 10, 20, 0.98)',
        backdropFilter: 'blur(20px)',
        padding: '2rem',
        borderBottom: '1px solid var(--border)'
      } : {}}>
        {links.map(link => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={pathname === link.href ? 'active' : ''}
              onClick={() => setMobileOpen(false)}
              style={{ fontWeight: 600, fontSize: '0.8rem', letterSpacing: '1.5px' }}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'white' }}>
        <Search size={18} style={{ cursor: 'pointer', opacity: 0.8 }} />
        <ShoppingBag size={18} style={{ cursor: 'pointer', opacity: 0.8 }} />
        <Link href="/admin/login" style={{ textDecoration: 'none' }}>
           <ShieldCheck size={18} style={{ color: 'white', opacity: 0.8 }} />
        </Link>
        <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)} style={{ color: 'white' }}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
    </nav>
  );
}
