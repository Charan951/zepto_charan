import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Minus, Plus, ShoppingBag, ArrowLeft, ChevronRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import ProductCard from '@/components/ProductCard';
import { api, Product } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  const productQuery = useQuery({
    queryKey: ['productPublic', id],
    queryFn: () => api.productPublic(id as string),
    enabled: !!id,
  });

  const allProductsQuery = useQuery({
    queryKey: ['productsPublic'],
    queryFn: api.productsPublic,
    staleTime: 1000 * 60,
  });

  const productData = productQuery.data?.product as Product | undefined;
  const productsData = allProductsQuery.data?.products as Product[] | undefined;

  const product = productData || null;

  const similar = useMemo(() => {
    if (!product || !productsData || !productsData.length) return [] as Product[];
    const currentCategoryId =
      product.category && typeof product.category !== 'string' ? product.category._id : null;
    if (!currentCategoryId) return [] as Product[];
    const sims = productsData.filter(
      (p: Product) =>
        p._id !== product._id &&
        p.category &&
        typeof p.category !== 'string' &&
        p.category._id === currentCategoryId,
    );
    return sims.slice(0, 4);
  }, [product, productsData]);

  const loading = productQuery.isLoading || allProductsQuery.isLoading;
  const error =
    (productQuery.error instanceof Error ? productQuery.error.message : null) ||
    (allProductsQuery.error instanceof Error ? allProductsQuery.error.message : null);

  if (loading) {
    return (
      <div className="pt-28 pb-20 text-center">
        <p className="text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pt-28 pb-20 text-center">
        <p className="text-muted-foreground">{error || 'Product not found'}</p>
        <Link to="/products" className="text-primary mt-4 inline-block">
          Back to Products
        </Link>
      </div>
    );
  }

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
              {product.imageUrl ? (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-80 md:h-[450px] object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-80 md:h-[450px] bg-muted flex items-center justify-center text-sm text-muted-foreground">
                  No image
                </div>
              )}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
            <div>
              <p className="text-sm text-primary font-medium mb-1">
                {product.category && typeof product.category !== 'string' ? product.category.name : ''}
              </p>
              <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
              {product.description && (
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">{product.description}</p>
              )}
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold">{formatPrice(product.price)}</span>
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
                <ShoppingBag size={18} /> Add to Cart — {formatPrice(product.price * qty)}
              </motion.button>
            </div>

            {product.description && (
              <div className="border-t border-border pt-5">
                <h2 className="text-sm font-semibold mb-2">Description</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Similar Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similar.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
