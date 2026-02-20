import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Category } from '@/data/mockData';

interface Props {
  category: Category;
  index?: number;
}

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
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110" style={{ backgroundColor: category.color }}>
        {category.icon}
      </div>
      <div>
        <h3 className="font-semibold text-sm text-foreground">{category.name}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">{category.count} items</p>
      </div>
    </Link>
  </motion.div>
);

export default CategoryCard;
