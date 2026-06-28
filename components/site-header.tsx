import Link from "next/link";

const navItems = [
  { href: "/", label: "Catalogue" },
  { href: "/roadmap", label: "Roadmap" },
  { href: "/evidence", label: "Evidence" },
  { href: "/sources", label: "Sources" },
  { href: "/about", label: "About" }
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
        <Link href="/" className="flex items-baseline gap-3">
          <span className="font-mono text-sm uppercase text-zero-ink">ZERO</span>
          <span className="hidden text-sm text-zero-muted sm:inline">
            cooling possibilities
          </span>
        </Link>
        <nav
          aria-label="Primary navigation"
          className="flex w-fit flex-wrap gap-1 rounded-full bg-black/[0.045] p-1"
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-3.5 py-2 text-sm text-black/62 transition hover:bg-white hover:text-black hover:shadow-quiet"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
