import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Heart, Menu, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CartDrawer } from "./CartDrawer";
import { useWishlistStore } from "@/stores/wishlistStore";

const nav = [
  { to: "/", label: "Home" },
  { to: "/shop", label: "Shop" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const navigate = useNavigate();
  const wish = useWishlistStore((s) => s.items.length);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpen(false);
    navigate({ to: "/shop", search: q.trim() ? { q: q.trim() } : {} });
  };

  return (
    <header style={{ viewTransitionName: "site-header" }} className="sticky top-0 z-40 glass border-x-0 border-t-0">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link to="/" className="font-display text-2xl tracking-[0.3em] text-glow">CELESTIA</Link>
        <nav className="ml-6 hidden gap-6 md:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} activeOptions={{ exact: n.to === "/" }} className="text-sm tracking-wide text-muted-foreground transition hover:text-primary [&.active]:text-primary">
              {n.label}
            </Link>
          ))}
        </nav>
        <form onSubmit={submit} className="ml-auto hidden items-center lg:flex">
          <div className="glass flex items-center rounded-full px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the cosmos…" className="w-48 bg-transparent px-2 py-2 text-sm outline-none placeholder:text-muted-foreground" />
          </div>
        </form>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button variant="glass" size="icon" asChild className="relative" aria-label="Wishlist">
            <Link to="/wishlist">
              <Heart className="h-5 w-5" />
              {wish > 0 && <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-cosmic text-xs font-bold text-primary-foreground">{wish}</span>}
            </Link>
          </Button>
          <CartDrawer />
          <Button variant="glass" size="icon" className="md:hidden" aria-label="Menu" onClick={() => setOpen(!open)}>
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      {open && (
        <div className="space-y-3 border-t border-border px-4 py-4 md:hidden animate-rise">
          <form onSubmit={submit} className="glass flex items-center rounded-full px-3">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the cosmos…" className="w-full bg-transparent px-2 py-2 text-sm outline-none" />
          </form>
          {nav.map((n) => (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)} className="block py-1 text-lg text-foreground">{n.label}</Link>
          ))}
        </div>
      )}
    </header>
  );
}
