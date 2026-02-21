import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';

const CartDrawer = () => {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-background z-[70] flex flex-col shadow-elevated"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} className="text-primary" />
                <h2 className="font-bold text-lg">Your Cart</h2>
                <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">{totalItems} items</span>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-xl hover:bg-muted transition-colors">
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5 space-y-3">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag size={48} className="text-muted-foreground/30 mb-4" />
                  <p className="font-medium text-muted-foreground">Your cart is empty</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">Add some fresh items!</p>
                </div>
              ) : (
                <AnimatePresence>
                  {items.map(item => (
                    <motion.div
                      key={item.product._id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-3 glass-card-solid p-3"
                    >
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-16 h-16 rounded-xl object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                        {item.product.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {item.product.description}
                          </p>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-sm">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                              className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="text-sm font-medium w-5 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                              className="w-7 h-7 rounded-lg gradient-primary text-primary-foreground flex items-center justify-center"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-5 border-t border-border space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-bold">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-medium text-primary">Free</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t border-border pt-3">
                  <span>Total</span>
                  <span>{formatPrice(totalPrice)}</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3.5 rounded-2xl gradient-primary text-primary-foreground font-semibold flex items-center justify-center gap-2 shadow-sm"
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/checkout');
                  }}
                >
                  Checkout <ArrowRight size={18} />
                </motion.button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
