import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

const FloatingCartButton = () => {
  const { totalItems, setIsCartOpen } = useCart();

  if (totalItems === 0) return null;

  return (
    <motion.button
      initial={{ scale: 0, y: 50 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0, y: 50 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => setIsCartOpen(true)}
      className="fixed bottom-20 md:bottom-8 right-6 z-40 gradient-primary text-primary-foreground w-14 h-14 rounded-2xl flex items-center justify-center shadow-elevated animate-pulse-glow"
    >
      <ShoppingBag size={22} />
      <span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">
        {totalItems}
      </span>
    </motion.button>
  );
};

export default FloatingCartButton;
