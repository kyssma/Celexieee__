import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ArrowLeft, Heart, Loader2, Minus, Plus, ShoppingBag, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ProductCard, useAddToCart } from "@/components/site/ProductCard";
import { formatPrice, productQueryOptions, productsQueryOptions } from "@/lib/shopify";
import { useWishlistStore } from "@/stores/wishlistStore";

export const Route = createFileRoute("/product/$handle")({
  loader: async ({ context, params }) => {
    const product = await context.queryClient.ensureQueryData(productQueryOptions(params.handle));
    if (!product) throw notFound();
    await context.queryClient.ensureQueryData(productsQueryOptions());
    return { title: product.node.title, description: product.node.description, image: product.node.images.edges[0]?.node.url };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Unavailable — CELESTIA" }, { name: "robots", content: "noindex" }] };
    const meta = [
      { title: `${loaderData.title} — CELESTIA` },
      { name: "description", content: loaderData.description.slice(0, 160) },
      { property: "og:title", content: `${loaderData.title} — CELESTIA` },
      { property: "og:description", content: loaderData.description.slice(0, 160) },
      { property: "og:type", content: "product" },
    ];
    if (loaderData.image) meta.push({ property: "og:image", content: loaderData.image }, { name: "twitter:image", content: loaderData.image });
    return { meta };
  },
  notFoundComponent: () => (
    <div className="py-32 text-center">
      <p className="font-display text-3xl text-glow">Lost in space</p>
      <p className="mt-2 text-muted-foreground">This treasure drifted away.</p>
      <Button variant="cosmic" className="mt-6" asChild><Link to="/shop">Back to shop</Link></Button>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const { data: product } = useSuspenseQuery(productQueryOptions(handle));
  const { data: all } = useSuspenseQuery(productsQueryOptions());
  const [qty, setQty] = useState(1);
  const [img, setImg] = useState(0);
  const [busy, setBusy] = useState(false);
  const add = useAddToCart();
  const toggle = useWishlistStore((s) => s.toggle);
  const liked = useWishlistStore((s) => s.items.some((i) => i.node.handle === handle));
  if (!product) return null;
  const p = product.node;
  const variant = p.variants.edges[0]?.node;
  const images = p.images.edges;
  const related = all.filter((x) => x.node.productType === p.productType && x.node.handle !== p.handle).slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <Link to="/shop" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"><ArrowLeft className="h-4 w-4" />Back to collection</Link>
      <div className="mt-6 grid gap-10 md:grid-cols-2">
        <div className="animate-rise">
          <div className="glass overflow-hidden rounded-[2rem] shadow-glow">
            {images[img] && <img src={images[img].node.url} alt={images[img].node.altText ?? p.title} className="aspect-square w-full object-cover" />}
          </div>
          {images.length > 1 && (
            <div className="mt-4 flex gap-3">
              {images.map((im, i) => (
                <button key={im.node.url} onClick={() => setImg(i)} className={`h-20 w-20 overflow-hidden rounded-xl border-2 ${i === img ? "border-primary" : "border-transparent"}`}>
                  <img src={im.node.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="flex flex-col animate-rise" style={{ animationDelay: "120ms" }}>
          <Link to="/shop" search={{ category: p.productType }} className="text-sm uppercase tracking-[0.3em] text-primary">{p.productType}</Link>
          <h1 className="mt-2 font-display text-4xl leading-tight text-glow md:text-5xl">{p.title}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            {variant && <span className="text-3xl font-semibold text-primary">{formatPrice(variant.price)}</span>}
            {variant?.compareAtPrice && <span className="text-lg text-muted-foreground line-through">{formatPrice(variant.compareAtPrice)}</span>}
          </div>
          <p className="mt-6 font-serif text-xl leading-relaxed text-muted-foreground">{p.description}</p>
          <div className="mt-8 flex items-center gap-3">
            <div className="glass flex items-center rounded-full">
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))}><Minus className="h-4 w-4" /></Button>
              <span className="w-8 text-center">{qty}</span>
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Increase quantity" onClick={() => setQty(qty + 1)}><Plus className="h-4 w-4" /></Button>
            </div>
            <Button variant="glass" size="icon" aria-label="Toggle wishlist" onClick={() => toast(toggle(product) ? "Saved to wishlist ♡" : "Removed from wishlist", { position: "top-center" })}>
              <Heart className={`h-5 w-5 ${liked ? "fill-primary text-primary" : ""}`} />
            </Button>
          </div>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button variant="cosmic" size="lg" className="flex-1" disabled={busy || !variant?.availableForSale} onClick={async () => { setBusy(true); await add(product, qty, true); setBusy(false); }}>
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <><ShoppingBag className="h-4 w-4" />{variant?.availableForSale ? "Add to Bag" : "Sold out"}</>}
            </Button>
          </div>
          <div className="glass mt-8 space-y-2 rounded-2xl p-5 text-sm text-muted-foreground">
            <p className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />Gift-wrapped in stardust tissue</p>
            <p className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />Secure checkout</p>
          </div>
          <div className="mt-8">
            <h2 className="font-serif text-2xl">Reviews</h2>
            <p className="mt-2 text-sm text-muted-foreground">No reviews yet.</p>
          </div>
        </div>
      </div>
      {related.length > 0 && (
        <section className="mt-20">
          <h2 className="font-display text-3xl text-glow">You may also love</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((r, i) => <ProductCard key={r.node.id} product={r} index={i} />)}
          </div>
        </section>
      )}
    </div>
  );
}
