"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Today" },
  { href: "/archive", label: "Archive" },
  { href: "/saved", label: "Saved" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="flex items-center justify-between h-12 px-8 max-w-[720px] mx-auto w-full">
      <span className="font-serif text-base font-semibold text-ink">
        Morning Round
      </span>
      <nav className="flex gap-6">
        {NAV_ITEMS.map(({ href, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={
                isActive
                  ? "font-sans text-sm text-ink border-b border-umber pb-0.5"
                  : "font-sans text-sm text-ink-secondary hover:text-ink transition-colors"
              }
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
