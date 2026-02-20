import { motion } from 'framer-motion';
import { categories } from '@/data/mockData';
import CategoryCard from '@/components/CategoryCard';

const Categories = () => (
  <div className="pt-24 pb-24 md:pb-8">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Categories</h1>
        <p className="text-muted-foreground mb-8">Browse products by category</p>
      </motion.div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
        {categories.map((cat, i) => (
          <CategoryCard key={cat.id} category={cat} index={i} />
        ))}
      </div>
    </div>
  </div>
);

export default Categories;
