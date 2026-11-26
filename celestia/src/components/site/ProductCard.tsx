import { Link } from "@tanstack/react-router";
import { Heart, Loader2, ShoppingBag } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatPrice, type ShopifyProduct } from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";
import { useWishlistStore } from "@/stores/wishlistStore";
import { useState } from "react";

export function useAddToCart() {
  const addItem = useCartStore((s) => s.addItem);
  const setOpen = useCartStore((s) => s.setOpen);
  return async (product: ShopifyProduct, quantity = 1, openDrawer = false) => {
    const v = product.node.variants.edges[0]?.node;
    if (!v) return false;
    const ok = await addItem({ product, variantId: v.id, variantTitle: v.title, price: v.price, quantity, selectedOptions: v.selectedOptions });
    if (ok) {
      toast.success(`${product.node.title} added to your bag`, { position: "top-center" });
      if (openDrawer) setOpen(true);
    } else toast.error("Couldn't add to bag. Please try again.", { position: "top-center" });
    return ok;
  };
}

export function ProductCard({ product, index = 0 }: { product: ShopifyProduct; index?: number }) {
  const p = product.node;
  const img = p.images.edges[0]?.node;
  const compare = p.variants.edges[0]?.node.compareAtPrice;
  const add = useAddToCart();
  const [busy, setBusy] = useState(false);
  const toggle = useWishlistStore((s) => s.toggle);
  const liked = useWishlistStore((s) => s.items.some((i) => i.node.handle === p.handle));

  return (
    <div className="group glass glow-hover relative flex flex-col overflow-hidden rounded-3xl animate-rise" style={{ animationDelay: `${index * 60}ms` }}>
      <Link to="/product/$handle" params={{ handle: p.handle }} className="relative block aspect-square overflow-hidden">
        {img && <img src={img.url} alt={img.altText ?? p.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />}
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
        <span className="absolute left-3 top-3 rounded-full glass px-3 py-1 text-xs tracking-wide">{p.productType}</span>
      </Link>
      <button
        aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
        onClick={() => {
          const added = toggle(product);
          toast(added ? "Saved to wishlist ♡" : "Removed from wishlist", { position: "top-center" });
        }}
        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full glass transition hover:scale-110"
      >
        <Heart className={`h-5 w-5 ${liked ? "fill-primary text-primary" : ""}`} />
      </button>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <Link to="/product/$handle" params={{ handle: p.handle }} className="font-serif text-2xl leading-tight transition hover:text-primary">{p.title}</Link>
        <p className="line-clamp-2 text-sm text-muted-foreground">{p.description}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div>
            <span className="text-lg font-semibold text-primary">{formatPrice(p.priceRange.minVariantPrice)}</span>
            {compare && <span className="ml-2 text-sm text-muted-foreground line-through">{formatPrice(compare)}</span>}
          </div>
          <Button variant="cosmic" size="sm" disabled={busy} onClick={async () => { setBusy(true); await add(product); setBusy(false); }}>
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <><ShoppingBag className="h-4 w-4" />Add</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
