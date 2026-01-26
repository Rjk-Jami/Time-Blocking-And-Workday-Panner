import Link from "next/link";

const links = [
  { href: "/today", label: "Today" },
  { href: "/week", label: "Week" },
  { href: "/templates", label: "Templates" },
  { href: "/insights", label: "Insights" },
  { href: "/settings", label: "Settings" },
];

export default function AppNav() {
  return (
    <header className="border-b">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/today" className="font-semibold">
          Time Blocking
        </Link>
        <nav className="flex gap-3 text-sm">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:underline">
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
