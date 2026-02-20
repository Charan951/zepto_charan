import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Minus, Plus, ShoppingBag, ArrowLeft, ChevronRight } from 'lucide-react';
import { products } from '@/data/mockData';
import { useCart } from '@/hooks/useCart';
import ProductCard from '@/components/ProductCard';

const ProductDetail = () => {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id));
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  if (!product) return (
    <div className="pt-28 pb-20 text-center">
      <p className="text-muted-foreground">Product not found</p>
      <Link to="/products" className="text-primary mt-4 inline-block">Back to Products</Link>
    </div>
  );

  const similar = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
  };

  return (
    <div className="pt-24 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        <Link to="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft size={16} /> Back to Products
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Image */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card-solid overflow-hidden rounded-3xl">
            <div className="relative overflow-hidden group">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-80 md:h-[450px] object-cover transition-transform duration-500 group-hover:scale-110"
              />
              {product.discount > 0 && (
                <span className="absolute top-4 left-4 gradient-accent text-accent-foreground text-sm font-bold px-3 py-1.5 rounded-xl">
                  -{product.discount}% OFF
                </span>
              )}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <div>
              <p className="text-sm text-primary font-medium mb-1">{product.category}</p>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star size={16} className="fill-accent text-accent" />
                  <span className="font-medium text-sm">{product.rating}</span>
                </div>
                <span className="text-muted-foreground text-sm">· {product.weight}</span>
              </div>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
              {product.originalPrice > product.price && (
                <span className="text-lg text-muted-foreground line-through">${product.originalPrice.toFixed(2)}</span>
              )}
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 glass-card-solid px-3 py-2 rounded-2xl">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-8 h-8 rounded-xl bg-muted flex items-center justify-center hover:bg-muted/80">
                  <Minus size={16} />
                </button>
                <span className="font-semibold w-6 text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="w-8 h-8 rounded-xl gradient-primary text-primary-foreground flex items-center justify-center">
                  <Plus size={16} />
                </button>
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleAdd}
                className="flex-1 gradient-primary text-primary-foreground py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2"
              >
                <ShoppingBag size={18} /> Add to Cart — ${(product.price * qty).toFixed(2)}
              </motion.button>
            </div>

            {/* Tabs */}
            <div className="border-t border-border pt-5">
              <div className="flex gap-4 mb-4">
                {['description', 'nutrition'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-sm font-medium pb-2 border-b-2 transition-colors capitalize ${activeTab === tab ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              {activeTab === 'description' && (
                <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
              )}
              {activeTab === 'nutrition' && (
                <div className="grid grid-cols-2 gap-3">
                  {product.nutrition.map(n => (
                    <div key={n.label} className="glass-card-solid p-3 rounded-xl">
                      <p className="text-xs text-muted-foreground">{n.label}</p>
                      <p className="font-semibold text-sm">{n.value}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similar.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
