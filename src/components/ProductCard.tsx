import { motion } from 'framer-motion';
import { Plus, Star } from 'lucide-react';
import { Product } from '@/data/mockData';
import { useCart } from '@/hooks/useCart';
import { Link } from 'react-router-dom';

interface Props {
  product: Product;
  index?: number;
}

const ProductCard = ({ product, index = 0 }: Props) => {
  const { addToCart } = useCart();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="glass-card-solid group hover-lift overflow-hidden"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden rounded-t-2xl">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-44 object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
          />
          {product.discount > 0 && (
            <span className="absolute top-3 left-3 gradient-accent text-accent-foreground text-xs font-bold px-2.5 py-1 rounded-lg">
              -{product.discount}%
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <div className="flex items-center gap-1 mb-1.5">
          <Star size={12} className="fill-accent text-accent" />
          <span className="text-xs font-medium text-muted-foreground">{product.rating}</span>
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-sm text-foreground mb-0.5 line-clamp-1 hover:text-primary transition-colors">{product.name}</h3>
        </Link>
        <p className="text-xs text-muted-foreground mb-3">{product.weight}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-baseline gap-1.5">
            <span className="font-bold text-foreground">${product.price.toFixed(2)}</span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.85 }}
            whileHover={{ scale: 1.1 }}
            onClick={(e) => { e.preventDefault(); addToCart(product); }}
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
