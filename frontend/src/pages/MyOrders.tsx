import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api, type Order } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

const MyOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await api.myOrders();
        if (!cancelled) {
          setOrders(data.orders || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load orders");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="pt-24 pb-24 md:pb-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">My Orders</h1>
          <p className="text-muted-foreground">
            View your recent orders and track their status.
          </p>
        </motion.div>

        {loading && <div className="text-sm text-muted-foreground">Loading your orders...</div>}
        {error && !loading && <div className="text-sm text-destructive mb-4">{error}</div>}

        {!loading && !orders.length && !error && (
          <div className="glass-card-solid p-6 text-center text-sm text-muted-foreground">
            You have not placed any orders yet.
          </div>
        )}

        <div className="space-y-4">
          {orders.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-card-solid p-4 md:p-5 flex flex-col gap-3"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                  <div className="text-xs text-muted-foreground">Order ID</div>
                  <div className="text-sm font-medium break-all">{order._id}</div>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground">Placed on</div>
                    <div className="text-sm font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}{" "}
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Total</div>
                    <div className="text-base font-semibold">{formatPrice(order.totalAmount)}</div>
                  </div>
                {order.paymentMethod && (
                  <div>
                    <div className="text-xs text-muted-foreground">Payment method</div>
                    <div className="text-xs font-medium capitalize px-2 py-1 rounded-full bg-muted inline-block">
                      {order.paymentMethod === "cod" ? "Cash on delivery" : "Online payment"}
                    </div>
                  </div>
                )}
                  <div>
                    <div className="text-xs text-muted-foreground">Status</div>
                    <div className="text-xs font-medium capitalize px-2 py-1 rounded-full bg-muted inline-block">
                      {order.status}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Payment</div>
                    <div className="text-xs font-medium capitalize px-2 py-1 rounded-full bg-muted inline-block">
                      {order.paymentStatus}
                    </div>
                  </div>
                </div>
              </div>
              <div className="border-t border-border pt-3 text-xs text-muted-foreground">
                {order.items
                  .map((item) => `${item.quantity}× ${item.name}`)
                  .slice(0, 3)
                  .join(", ")}
                {order.items.length > 3 ? "…" : ""}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
