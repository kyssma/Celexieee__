import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/site/ProductCard";
import { CATEGORIES, productsQueryOptions } from "@/lib/shopify";

const HERO = "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80";
const OG = "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200&h=630&fit=crop";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CELESTIA — A Little Piece of the Universe" },
      { name: "description", content: "Shop dreamy planets, galaxies, stars, moons and cosmic accessories at CELESTIA." },
      { property: "og:title", content: "CELESTIA — A Little Piece of the Universe" },
      { property: "og:description", content: "Shop dreamy planets, galaxies, stars, moons and cosmic accessories at CELESTIA." },
      { property: "og:image", content: OG },
      { name: "twitter:image", content: OG },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQueryOptions()),
  component: Index,
});

function Index() {
  const { data: products } = useSuspenseQuery(productsQueryOptions());
  const featured = products.filter((p) => p.node.tags.includes("featured")).slice(0, 4);
  const shown = featured.length ? featured : products.slice(0, 4);
  const planet = products[0]?.node.images.edges[0]?.node.url;
  const moon = products.find((p) => p.node.productType === "Moons")?.node.images.edges[0]?.node.url;

  return (
    <>
      <section className="relative flex min-h-[88vh] items-center overflow-hidden">
        <img src={HERO} alt="Pink and violet nebula" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background/30 via-background/40 to-background" />
        {planet && <img src={planet} alt="" aria-hidden className="cosmic-orb absolute -right-16 top-16 hidden h-72 w-72 rounded-full object-cover shadow-glow animate-float md:block" />}
        {moon && <img src={moon} alt="" aria-hidden className="cosmic-orb absolute bottom-20 left-8 hidden h-28 w-28 rounded-full object-cover shadow-glow animate-float md:block" style={{ animationDelay: "2s" }} />}
        <div className="mx-auto max-w-5xl px-4 text-center animate-rise">
          <p className="mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Cosmic Boutique
          </p>
          <h1 className="font-display text-4xl leading-tight text-glow sm:text-6xl md:text-7xl">A LITTLE PIECE OF THE UNIVERSE</h1>
          <p className="mx-auto mt-6 max-w-xl font-serif text-xl text-muted-foreground md:text-2xl">Planets, galaxies, stars and moons — dreamy treasures to bring starlight into your home.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button variant="cosmic" size="lg" className="px-8" asChild><Link to="/shop">Explore Collection</Link></Button>
            <Button variant="glass" size="lg" className="px-8" asChild><a href="#featured">Shop Now</a></Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-primary">Collections</p>
          <h2 className="mt-3 font-display text-3xl text-glow md:text-4xl">Shop by Constellation</h2>
          <p className="mx-auto mt-4 max-w-md font-serif text-lg text-muted-foreground">Pick a corner of the sky and wander in.</p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} to="/shop" search={{ category: c.slug }} className="group glass glow-hover relative block overflow-hidden rounded-[2rem]">
              <img src={c.image} alt="" aria-hidden className="aspect-square w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/85 via-background/15 to-transparent" />
              <span className="absolute right-3 top-3 text-base opacity-80 drop-shadow-[0_0_8px_rgba(0,0,0,0.6)]">{c.emoji}</span>
              <div className="absolute inset-x-0 bottom-0 p-4 text-center">
                <p className="font-serif text-lg leading-tight md:text-xl">{c.label}</p>
                <p className="mt-1 text-[0.6rem] uppercase tracking-[0.25em] text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">Browse</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section id="featured" className="mx-auto max-w-7xl scroll-mt-24 px-4 py-16">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-primary">Featured</p>
            <h2 className="font-display text-3xl text-glow md:text-4xl">Stellar Favorites</h2>
          </div>
          <Button variant="glass" asChild><Link to="/shop">View all</Link></Button>
        </div>
        {shown.length === 0 ? (
          <p className="text-center text-muted-foreground">No products found</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {shown.map((p, i) => <ProductCard key={p.node.id} product={p} index={i} />)}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="glass relative overflow-hidden rounded-[2.5rem] p-10 text-center md:p-16">
          <div className="absolute -top-20 left-1/2 h-60 w-60 -translate-x-1/2 rounded-full bg-cosmic opacity-30 blur-3xl" />
          <h2 className="relative font-display text-3xl text-glow md:text-4xl">Wish upon a star</h2>
          <p className="relative mx-auto mt-4 max-w-lg font-serif text-xl text-muted-foreground">Save your favorite cosmic treasures and come back whenever the stars align.</p>
          <Button variant="cosmic" size="lg" className="relative mt-8" asChild><Link to="/wishlist">Open my wishlist</Link></Button>
        </div>
      </section>
    </>
  );
}
