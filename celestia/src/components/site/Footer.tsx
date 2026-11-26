import { Link } from "@tanstack/react-router";
import { CATEGORIES } from "@/lib/shopify";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-2xl tracking-[0.3em] text-glow">CELESTIA</p>
          <p className="mt-3 max-w-sm font-serif text-lg text-muted-foreground">Dreamy treasures from across the universe, made to bring a little starlight home.</p>
        </div>
        <div>
          <p className="mb-3 text-sm uppercase tracking-widest text-primary">Shop</p>
          {CATEGORIES.map((c) => (
            <Link key={c.slug} to="/shop" search={{ category: c.slug }} className="block py-1 text-sm text-muted-foreground hover:text-primary">{c.label}</Link>
          ))}
        </div>
        <div>
          <p className="mb-3 text-sm uppercase tracking-widest text-primary">Celestia</p>
          <Link to="/about" className="block py-1 text-sm text-muted-foreground hover:text-primary">About Us</Link>
          <Link to="/contact" className="block py-1 text-sm text-muted-foreground hover:text-primary">Contact</Link>
          <Link to="/wishlist" className="block py-1 text-sm text-muted-foreground hover:text-primary">Wishlist</Link>
          <Link to="/cart" className="block py-1 text-sm text-muted-foreground hover:text-primary">Cart</Link>
        </div>
      </div>
      <p className="pb-8 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} CELESTIA · Made with stardust</p>
    </footer>
  );
}
