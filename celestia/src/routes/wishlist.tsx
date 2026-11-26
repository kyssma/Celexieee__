import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/site/ProductCard";
import { useWishlistStore } from "@/stores/wishlistStore";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "My Wishlist — CELESTIA" },
      { name: "description", content: "Your saved cosmic treasures at CELESTIA." },
      { property: "og:title", content: "My Wishlist — CELESTIA" },
      { property: "og:description", content: "Your saved cosmic treasures at CELESTIA." },
    ],
  }),
  component: Wishlist,
});

function Wishlist() {
  const items = useWishlistStore((s) => s.items);
  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-center font-display text-4xl text-glow md:text-5xl">My Wishlist</h1>
      {items.length === 0 ? (
        <div className="glass mx-auto mt-10 max-w-lg rounded-3xl p-12 text-center">
          <Heart className="mx-auto h-12 w-12 text-primary" />
          <p className="mt-4 font-serif text-2xl">No wishes yet</p>
          <p className="mt-2 text-muted-foreground">Tap the heart on any treasure to save it here.</p>
          <Button variant="cosmic" className="mt-6" asChild><Link to="/shop">Explore Collection</Link></Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((p, i) => <ProductCard key={p.node.id} product={p} index={i} />)}
        </div>
      )}
    </div>
  );
}
