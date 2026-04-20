"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// =============================================================================
// Sidebar — Main navigation for the SaaS dashboard
// =============================================================================

const NAV_ITEMS = [
  {
    label: "Mes sites",
    href: "/dashboard",
    icon: LayoutIcon,
  },
  {
    label: "Nouveau site",
    href: "/generate",
    icon: PlusIcon,
  },
  {
    label: "Démo",
    href: "/preview/demo",
    icon: PlayIcon,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="
        hidden lg:flex flex-col
        w-64 h-screen
        bg-[var(--sf-app-surface)]
        border-r border-[var(--sf-app-border)]
        px-4 py-6
      "
    >
      {/* Logo */}
      <Link href="/dashboard" className="flex items-center gap-2.5 px-3 mb-10">
        <div className="w-8 h-8 rounded-lg bg-[var(--sf-app-accent)] flex items-center justify-center">
          <span className="text-white font-bold text-sm">SF</span>
        </div>
        <span className="text-lg font-semibold tracking-tight">SiteForge</span>
      </Link>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg
                text-sm font-medium transition-colors duration-150
                ${
                  isActive
                    ? "bg-[var(--sf-app-accent)]/10 text-[var(--sf-app-accent)]"
                    : "text-[var(--sf-app-text-muted)] hover:text-[var(--sf-app-text)] hover:bg-[var(--sf-app-surface-hover)]"
                }
              `}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 pt-4 border-t border-[var(--sf-app-border)] space-y-3">
        <CreditBadgeSimple />
        <UserBadge />
      </div>
    </aside>
  );
}

// -- Inline SVG Icons (avoid external dependency for MVP) ---------------------

function LayoutIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18" />
      <path d="M9 21V9" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

function CreditBadgeSimple() {
  const [balance, setBalance] = useState(0);
  useEffect(() => {
    import("@/lib/credits").then((mod) => {
      setBalance(mod.getCredits());
    });
  }, []);

  return (
    <div className="flex items-center gap-2 px-1 text-xs text-[var(--sf-app-text-muted)]">
      <span>💰</span>
      <span>{balance} crédits</span>
    </div>
  );
}

function UserBadge() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    import("@/lib/auth").then(async (mod) => {
      const u = await mod.getUser();
      if (u) setUser({ name: u.name, email: u.email });
    });
  }, []);

  function handleLogout() {
    import("@/lib/auth").then(async (mod) => {
      await mod.logout();
      window.location.href = "/login";
    });
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 px-2 py-2 rounded-lg text-xs text-[var(--sf-app-text-muted)] hover:text-[var(--sf-app-text)] hover:bg-[var(--sf-app-surface-hover)] transition-colors"
      >
        <div className="w-6 h-6 rounded-full bg-[var(--sf-app-border)] flex items-center justify-center text-[10px]">
          ?
        </div>
        Se connecter
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2 px-1">
      <div className="w-7 h-7 rounded-full bg-[var(--sf-app-accent)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
        {user.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium truncate">{user.name}</p>
        <p className="text-[10px] text-[var(--sf-app-text-muted)] truncate">{user.email}</p>
      </div>
      <button
        onClick={handleLogout}
        title="Déconnexion"
        className="p-1 rounded text-[var(--sf-app-text-muted)] hover:text-red-400 transition-colors cursor-pointer flex-shrink-0"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
      </button>
    </div>
  );
}
