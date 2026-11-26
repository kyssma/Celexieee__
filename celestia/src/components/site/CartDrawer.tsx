import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShoppingBag, Minus, Plus, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/shopify";

export function CartDrawer() {
  const { items, isLoading, isSyncing, updateQuantity, removeItem, getCheckoutUrl, syncCart, isOpen, setOpen } = useCartStore();
  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const total = items.reduce((s, i) => s + parseFloat(i.price.amount) * i.quantity, 0);
  const currency = items[0]?.price.currencyCode ?? "PHP";

  useEffect(() => {
    if (isOpen) syncCart();
  }, [isOpen, syncCart]);

  const checkout = () => {
    const url = getCheckoutUrl();
    if (url) {
      window.open(url, "_blank");
      setOpen(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="glass" size="icon" className="relative" aria-label="Open cart">
          <ShoppingBag className="h-5 w-5" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-cosmic text-xs font-bold text-primary-foreground">
              {totalItems}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex h-full w-full flex-col border-border bg-popover sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="font-display text-2xl text-glow">Your Cosmic Bag</SheetTitle>
          <SheetDescription>{totalItems === 0 ? "Your bag is empty" : `${totalItems} item${totalItems !== 1 ? "s" : ""}`}</SheetDescription>
        </SheetHeader>
        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            <p className="text-muted-foreground">No stars collected yet.</p>
            <Button variant="cosmic" asChild onClick={() => setOpen(false)}>
              <Link to="/shop">Explore Collection</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4">
              {items.map((item) => (
                <div key={item.variantId} className="glass flex gap-3 rounded-2xl p-3">
                  <img src={item.product.node.images.edges[0]?.node.url} alt={item.product.node.title} className="h-16 w-16 rounded-xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <h4 className="truncate font-medium">{item.product.node.title}</h4>
                    <p className="text-sm text-primary">{formatPrice(item.price)}</p>
                    <div className="mt-1 flex items-center gap-1">
                      <Button variant="glass" size="icon" className="h-7 w-7" aria-label="Decrease" onClick={() => updateQuantity(item.variantId, item.quantity - 1)}><Minus className="h-3 w-3" /></Button>
                      <span className="w-7 text-center text-sm">{item.quantity}</span>
                      <Button variant="glass" size="icon" className="h-7 w-7" aria-label="Increase" onClick={() => updateQuantity(item.variantId, item.quantity + 1)}><Plus className="h-3 w-3" /></Button>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" aria-label="Remove" onClick={() => removeItem(item.variantId)}><Trash2 className="h-4 w-4" /></Button>
                </div>
              ))}
            </div>
            <div className="space-y-3 border-t border-border p-4">
              <div className="flex justify-between text-lg">
                <span>Subtotal</span>
                <span className="font-semibold">{formatPrice({ amount: String(total), currencyCode: currency })}</span>
              </div>
              <Button variant="cosmic" size="lg" className="w-full" onClick={checkout} disabled={isLoading || isSyncing}>
                {isLoading || isSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <><ExternalLink className="mr-2 h-4 w-4" />Secure Checkout</>}
              </Button>
              <Button variant="glass" className="w-full" asChild onClick={() => setOpen(false)}>
                <Link to="/cart">View full cart</Link>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
