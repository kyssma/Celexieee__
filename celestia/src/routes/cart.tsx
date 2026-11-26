import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, Loader2, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/shopify";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag — CELESTIA" },
      { name: "description", content: "Review your cosmic treasures and check out securely." },
      { property: "og:title", content: "Your Bag — CELESTIA" },
      { property: "og:description", content: "Review your cosmic treasures and check out securely." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const { items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl } = useCartStore();
  const total = items.reduce((s, i) => s + parseFloat(i.price.amount) * i.quantity, 0);
  const currency = items[0]?.price.currencyCode ?? "PHP";
  const checkout = () => {
    const url = getCheckoutUrl();
    if (url) window.open(url, "_blank");
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-center font-display text-4xl text-glow md:text-5xl">Your Cosmic Bag</h1>
      {items.length === 0 ? (
        <div className="glass mx-auto mt-10 max-w-lg rounded-3xl p-12 text-center">
          <ShoppingBag className="mx-auto h-12 w-12 text-primary" />
          <p className="mt-4 font-serif text-2xl">Your bag is empty</p>
          <Button variant="cosmic" className="mt-6" asChild><Link to="/shop">Shop Now</Link></Button>
        </div>
      ) : (
        <div className="mt-10 grid gap-8 md:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.variantId} className="glass flex items-center gap-4 rounded-3xl p-4">
                <Link to="/product/$handle" params={{ handle: item.product.node.handle }}>
                  <img src={item.product.node.images.edges[0]?.node.url} alt={item.product.node.title} className="h-24 w-24 rounded-2xl object-cover" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link to="/product/$handle" params={{ handle: item.product.node.handle }} className="font-serif text-xl hover:text-primary">{item.product.node.title}</Link>
                  <p className="text-primary">{formatPrice(item.price)}</p>
                  <div className="mt-2 flex items-center gap-1">
                    <Button variant="glass" size="icon" className="h-8 w-8" aria-label="Decrease" onClick={() => updateQuantity(item.variantId, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <Button variant="glass" size="icon" className="h-8 w-8" aria-label="Increase" onClick={() => updateQuantity(item.variantId, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                  </div>
                </div>
                <Button variant="ghost" size="icon" aria-label="Remove" onClick={() => removeItem(item.variantId)}><Trash2 className="h-4 w-4" /></Button>
              </div>
            ))}
          </div>
          <div className="glass h-fit space-y-4 rounded-3xl p-6">
            <p className="font-serif text-2xl">Order summary</p>
            <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{formatPrice({ amount: String(total), currencyCode: currency })}</span></div>
            <p className="text-xs text-muted-foreground">Shipping and taxes are calculated at checkout. You'll get an order confirmation by email once payment is complete.</p>
            <Button variant="cosmic" size="lg" className="w-full" onClick={checkout} disabled={isLoading || isSyncing}>
              {isLoading || isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <><ExternalLink className="h-4 w-4" />Secure Checkout</>}
            </Button>
            <Button variant="glass" className="w-full" asChild><Link to="/shop">Continue shopping</Link></Button>
          </div>
        </div>
      )}
    </div>
  );
}
