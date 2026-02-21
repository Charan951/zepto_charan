import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Category } from '@/lib/api';

interface Props {
  category: Category;
  index?: number;
}

const iconMap: Record<string, string> = {
  'Fruits & Vegetables': '🥬',
  'Dairy & Eggs': '🥛',
  Snacks: '🍿',
  Beverages: '🥤',
  'Personal Care': '🧴',
  Household: '🏠',
  Bakery: '🍞',
  'Meat & Fish': '🥩',
};

const colorMap: Record<string, string> = {
  'Fruits & Vegetables': 'hsl(120, 50%, 92%)',
  'Dairy & Eggs': 'hsl(45, 80%, 92%)',
  Snacks: 'hsl(15, 80%, 92%)',
  Beverages: 'hsl(200, 70%, 92%)',
  'Personal Care': 'hsl(300, 50%, 92%)',
  Household: 'hsl(30, 60%, 92%)',
  Bakery: 'hsl(35, 80%, 92%)',
  'Meat & Fish': 'hsl(0, 60%, 92%)',
};

const CategoryCard = ({ category, index = 0 }: Props) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.05, duration: 0.3 }}
  >
    <Link
      to={`/products?category=${encodeURIComponent(category.name)}`}
      className="glass-card-solid hover-lift p-5 flex flex-col items-center gap-3 text-center group cursor-pointer block"
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110"
        style={{ backgroundColor: colorMap[category.name] || 'hsl(0, 0%, 95%)' }}
      >
        {iconMap[category.name] || '🛒'}
      </div>
      <div>
        <h3 className="font-semibold text-sm text-foreground">{category.name}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Browse items</p>
      </div>
    </Link>
  </motion.div>
);

export default CategoryCard;
