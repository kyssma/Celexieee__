import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { Search } from "lucide-react";
import { ProductCard } from "@/components/site/ProductCard";
import { CATEGORIES, productsQueryOptions } from "@/lib/shopify";

type ShopSearch = { q?: string; category?: string; sort?: string; max?: number };

export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): ShopSearch => {
    const out: ShopSearch = {};
    if (typeof s["q"] === "string" && s["q"]) out.q = s["q"];
    if (typeof s["category"] === "string" && s["category"]) out.category = s["category"];
    if (typeof s["sort"] === "string" && s["sort"]) out.sort = s["sort"];
    const max = Number(s["max"]);
    if (Number.isFinite(max) && max > 0) out.max = max;
    return out;
  },
  head: () => ({
    meta: [
      { title: "Shop the Collection — CELESTIA" },
      { name: "description", content: "Browse planets, galaxies, stars, moons and cosmic accessories. Search, filter and sort the full CELESTIA collection." },
      { property: "og:title", content: "Shop the Collection — CELESTIA" },
      { property: "og:description", content: "Browse planets, galaxies, stars, moons and cosmic accessories." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQueryOptions()),
  component: Shop,
});

const PRICE_CAPS = [1000, 1500, 2000, 3000];

function Shop() {
  const { data: products } = useSuspenseQuery(productsQueryOptions());
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/shop" });
  const set = (patch: Partial<Record<keyof ShopSearch, string | number | undefined>>) =>
    navigate({
      search: (prev) => {
        const next: Record<string, unknown> = { ...prev, ...patch };
        Object.keys(next).forEach((k) => (next[k] === undefined || next[k] === "") && delete next[k]);
        return next as ShopSearch;
      },
      replace: true,
      viewTransition: false,
    });

  const list = useMemo(() => {
    const q = (search.q ?? "").toLowerCase();
    const r = products.filter((p) => {
      const n = p.node;
      const price = parseFloat(n.priceRange.minVariantPrice.amount);
      if (search.category && n.productType !== search.category) return false;
      if (search.max && price > search.max) return false;
      if (q && !`${n.title} ${n.description} ${n.productType} ${n.tags.join(" ")}`.toLowerCase().includes(q)) return false;
      return true;
    });
    const price = (x: (typeof r)[number]) => parseFloat(x.node.priceRange.minVariantPrice.amount);
    if (search.sort === "price-asc") r.sort((a, b) => price(a) - price(b));
    else if (search.sort === "price-desc") r.sort((a, b) => price(b) - price(a));
    else if (search.sort === "name") r.sort((a, b) => a.node.title.localeCompare(b.node.title));
    else if (search.sort === "newest") r.sort((a, b) => b.node.createdAt.localeCompare(a.node.createdAt));
    return r;
  }, [products, search]);

  const chip = (active: boolean) => `rounded-full px-4 py-2 text-sm transition ${active ? "bg-cosmic text-primary-foreground shadow-glow" : "glass hover:text-primary"}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <h1 className="text-center font-display text-4xl text-glow md:text-5xl">The Collection</h1>
      <p className="mt-3 text-center font-serif text-xl text-muted-foreground">Find your little piece of the universe.</p>

      <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center">
        <div className="glass flex flex-1 items-center rounded-full px-4">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input aria-label="Search products" value={search.q ?? ""} onChange={(e) => set({ q: e.target.value })} placeholder="Search planets, moons, nebulae…" className="w-full bg-transparent px-3 py-3 outline-none placeholder:text-muted-foreground" />
        </div>
        <select aria-label="Sort" value={search.sort ?? ""} onChange={(e) => set({ sort: e.target.value })} className="glass rounded-full px-4 py-3 outline-none [&>option]:bg-popover">
          <option value="">Sort: Featured</option>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          <option value="name">Name A–Z</option>
        </select>
        <select aria-label="Max price" value={search.max ?? ""} onChange={(e) => set({ max: e.target.value ? Number(e.target.value) : undefined })} className="glass rounded-full px-4 py-3 outline-none [&>option]:bg-popover">
          <option value="">Any price</option>
          {PRICE_CAPS.map((c) => <option key={c} value={c}>Under ₱{c.toLocaleString()}</option>)}
        </select>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button className={chip(!search.category)} onClick={() => set({ category: undefined })}>All</button>
        {CATEGORIES.map((c) => (
          <button key={c.slug} className={chip(search.category === c.slug)} onClick={() => set({ category: c.slug })}>{c.emoji} {c.label}</button>
        ))}
      </div>

      <p className="mt-6 text-sm text-muted-foreground">{list.length} treasure{list.length !== 1 ? "s" : ""} found</p>
      {list.length === 0 ? (
        <div className="glass mt-6 rounded-3xl p-16 text-center">
          <p className="font-serif text-2xl">No products found</p>
          <button className="mt-4 text-primary underline" onClick={() => navigate({ search: {}, replace: true, viewTransition: false })}>Clear filters</button>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {list.map((p, i) => <ProductCard key={p.node.id} product={p} index={i} />)}
        </div>
      )}
    </div>
  );
}
