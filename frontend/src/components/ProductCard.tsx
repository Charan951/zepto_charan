import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { Product } from '@/lib/api';
import { useCart } from '@/hooks/useCart';
import { Link } from 'react-router-dom';
import { formatPrice } from '@/lib/utils';

interface Props {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: Props) => {
  const { addToCart } = useCart();
  const hasDiscount =
    typeof product.originalPrice === 'number' && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="glass-card-solid group hover-lift overflow-hidden"
    >
      <Link to={`/product/${product._id}`} className="block">
        <div className="relative overflow-hidden rounded-t-2xl">
          {product.imageUrl ? (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-44 bg-muted flex items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}
          {discountPercent !== null && (
            <div className="absolute top-2 right-2 bg-emerald-500 text-[10px] font-semibold text-white px-2 py-1 rounded-full shadow-sm">
              {discountPercent}% OFF
            </div>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold text-sm text-foreground mb-1 line-clamp-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        {product.description && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{product.description}</p>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-foreground">{formatPrice(product.price)}</span>
            {hasDiscount && product.originalPrice != null && (
              <>
                <span className="text-xs text-muted-foreground line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              </>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.1 }}
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            className="w-8 h-8 rounded-xl gradient-primary text-primary-foreground flex items-center justify-center shadow-sm"
          >
            <Plus size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
