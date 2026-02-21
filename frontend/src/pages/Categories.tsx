import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CategoryCard from '@/components/CategoryCard';
import { api, Category } from '@/lib/api';

const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    api
      .categoriesPublic()
      .then((data) => {
        if (!mounted) return;
        setCategories(data.categories);
      })
      .catch((err) => {
        if (!mounted) return;
        setError(err instanceof Error ? err.message : 'Failed to load categories');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="pt-24 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2">Categories</h1>
          <p className="text-muted-foreground mb-8">Browse products by category</p>
        </motion.div>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {categories.map((cat, i) => (
            <CategoryCard key={cat._id} category={cat} index={i} />
          ))}
          {!loading && categories.length === 0 && !error && (
            <p className="text-sm text-muted-foreground">No categories available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Categories;
