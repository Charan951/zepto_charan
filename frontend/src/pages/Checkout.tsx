import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/hooks/useCart";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const Checkout = () => {
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState(user?.name ?? "");
  const [customerEmail, setCustomerEmail] = useState(user?.email ?? "");
  const [customerPhone, setCustomerPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "online">("cod");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!items.length) {
      toast({ title: "Your cart is empty", description: "Add some items before checking out." });
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        customerName,
        customerEmail,
        customerPhone: customerPhone || undefined,
        address: address || undefined,
        notes: notes || undefined,
        paymentMethod,
        items: items.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
        })),
      };
      await api.checkout(payload);
      clearCart();
      toast({ title: "Order placed", description: "We are preparing your items." });
      navigate("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to place order";
      toast({
        title: "Checkout failed",
        description: message,
      });
    } finally {
      setSubmitting(false);
    }
  }

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="pt-24 pb-24 md:pb-12">
      <div className="container mx-auto px-4 grid gap-8 lg:grid-cols-[3fr,2fr]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2">Checkout</h1>
          <p className="text-muted-foreground mb-6">Enter your details to complete your order.</p>
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Customer details</CardTitle>
              <CardDescription>We will use this information for your order and updates.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="text-sm mb-1">Full name</div>
                  <Input
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    required
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <div className="text-sm mb-1">Email address</div>
                  <Input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    required
                    placeholder="you@example.com"
                  />
                </div>
                <div>
                  <div className="text-sm mb-1">Phone number</div>
                  <Input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div>
                  <div className="text-sm mb-1">Delivery address</div>
                  <Textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street, city, ZIP code"
                  />
                </div>
                <div>
                  <div className="text-sm mb-1">Notes (optional)</div>
                  <Textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Any delivery instructions or preferences?"
                  />
                </div>
                <div>
                  <div className="text-sm mb-2">Payment method</div>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("cod")}
                      className={`flex-1 rounded-xl border px-3 py-2 text-sm ${
                        paymentMethod === "cod"
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      Cash on delivery
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod("online")}
                      className={`flex-1 rounded-xl border px-3 py-2 text-sm ${
                        paymentMethod === "online"
                          ? "border-primary bg-primary/10 text-primary font-medium"
                          : "border-border text-muted-foreground hover:bg-muted"
                      }`}
                    >
                      Online payment
                    </button>
                  </div>
                </div>
                <Button
                  type="submit"
                  disabled={submitting || !customerName || !customerEmail || !items.length}
                  className="w-full md:w-auto"
                >
                  {submitting ? "Placing order..." : `Place order (${itemCount} item${itemCount === 1 ? "" : "s"})`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="space-y-4"
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Order summary</CardTitle>
              <CardDescription>{itemCount} item{itemCount === 1 ? "" : "s"} in your cart</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product._id} className="flex justify-between text-sm">
                    <div>
                      <div className="font-medium">{item.product.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {item.quantity} × {formatPrice(item.product.price)}
                      </div>
                    </div>
                    <div className="font-semibold">
                      {formatPrice(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
                {!items.length && (
                  <div className="text-sm text-muted-foreground">Your cart is empty.</div>
                )}
              </div>
              <div className="border-t border-border pt-3 space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-medium text-primary">Free</span>
                </div>
                <div className="flex justify-between pt-1 text-base font-semibold">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Checkout;
