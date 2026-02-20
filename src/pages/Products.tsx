import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { products, categories } from '@/data/mockData';
import ProductCard from '@/components/ProductCard';

const sortOptions = ['Recommended', 'Price: Low to High', 'Price: High to Low', 'Rating'];

const Products = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('Recommended');
  const [maxPrice, setMaxPrice] = useState(20);

  const filtered = useMemo(() => {
    let result = products.filter(p => p.price <= maxPrice);
    if (selectedCategory !== 'All') result = result.filter(p => p.category === selectedCategory);
    if (sortBy === 'Price: Low to High') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'Price: High to Low') result.sort((a, b) => b.price - a.price);
    if (sortBy === 'Rating') result.sort((a, b) => b.rating - a.rating);
    return result;
  }, [selectedCategory, sortBy, maxPrice]);

  return (
    <div className="pt-24 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2">Fresh Products</h1>
          <p className="text-muted-foreground mb-8">Browse our selection of premium groceries</p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-64 flex-shrink-0"
          >
            <div className="glass-card-solid p-5 space-y-6 sticky top-24">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2"><SlidersHorizontal size={16} /> Filters</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${selectedCategory === 'All' ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted'}`}
                  >
                    All Products
                  </button>
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors flex items-center gap-2 ${selectedCategory === cat.name ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted'}`}
                    >
                      <span>{cat.icon}</span> {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-3">Price Range</h4>
                <input
                  type="range"
                  min={0}
                  max={20}
                  step={0.5}
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>$0</span>
                  <span>${maxPrice.toFixed(2)}</span>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-3">Sort By</h4>
                <div className="space-y-1">
                  {sortOptions.map(opt => (
                    <button
                      key={opt}
                      onClick={() => setSortBy(opt)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${sortBy === opt ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-muted'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Products grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-muted-foreground">{filtered.length} products found</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-20 text-muted-foreground">
                <p className="text-lg font-medium">No products found</p>
                <p className="text-sm mt-1">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
