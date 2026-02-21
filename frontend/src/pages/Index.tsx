import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Zap, Clock, Truck, Shield, ChevronRight, ArrowRight, Star, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import { useScrollReveal } from '@/hooks/useScrollReveal';
import { api, Product, Category } from '@/lib/api';

const SectionHeader = ({ children }: { children: React.ReactNode }) => {
  const { ref, isInView } = useScrollReveal();
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
      {children}
    </motion.div>
  );
};

const HeroSection = () => (
  <section className="gradient-hero pt-28 pb-16 md:pt-36 md:pb-24 relative overflow-hidden">
    <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
    <div
      className="absolute bottom-10 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float"
      style={{ animationDelay: "1.5s" }}
    />
    <div className="absolute right-4 md:right-16 top-24 md:top-28 w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden shadow-elevated bg-white/80 hidden sm:block">
      <img src="/icon.png" alt="Quick Glow Grocer" className="w-full h-full object-cover" />
    </div>

    <div className="container mx-auto px-4 relative">
      <div className="max-w-2xl mx-auto text-center md:text-left md:mx-0">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Zap size={14} /> Lightning fast delivery
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold text-foreground leading-tight mb-5">
            Groceries in<br />
            <span className="text-gradient-primary">10 Minutes</span>
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-lg">
            Fresh produce, daily essentials, and more — delivered to your doorstep faster than you can say "fresh."
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }} className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Search for groceries..." className="w-full pl-11 pr-4 py-3.5 rounded-2xl glass-card-solid border-none outline-none text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 transition-shadow" />
          </div>
          <Link to="/products">
            <motion.button whileTap={{ scale: 0.95 }} className="gradient-primary text-primary-foreground px-8 py-3.5 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 shadow-sm whitespace-nowrap w-full sm:w-auto">
              Shop Now <ArrowRight size={16} />
            </motion.button>
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin size={14} className="text-primary" />
          <span>Delivering to <strong className="text-foreground">New York, NY</strong></span>
        </motion.div>
      </div>
    </div>
  </section>
);

const CategoriesSection = ({ categories }: { categories: Category[] }) => (
  <section className="py-16">
    <div className="container mx-auto px-4">
      <SectionHeader>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">Shop by Category</h2>
          <Link
            to="/categories"
            className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all"
          >
            View All <ChevronRight size={16} />
          </Link>
        </div>
      </SectionHeader>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {categories.map((cat, i) => (
          <CategoryCard key={cat._id} category={cat} index={i} />
        ))}
      </div>
    </div>
  </section>
);

const FlashDealsSection = ({ products }: { products: Product[] }) => {
  const dealProducts = products.slice(0, 4);
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <SectionHeader>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center animate-bounce-subtle">
                <Zap size={18} className="text-accent-foreground" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Flash Deals</h2>
                <p className="text-sm text-muted-foreground">Ends in 2h 34m</p>
              </div>
            </div>
            <Link to="/products" className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">See All <ChevronRight size={16} /></Link>
          </div>
        </SectionHeader>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {dealProducts.map((p, i) => (
            <ProductCard key={p._id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const TrendingSection = ({ products }: { products: Product[] }) => {
  const trending = products.slice(0, 4);
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Star size={18} className="text-primary" /></div>
              <h2 className="text-2xl md:text-3xl font-bold">Trending Now</h2>
            </div>
            <Link to="/products" className="text-primary text-sm font-medium flex items-center gap-1 hover:gap-2 transition-all">See All <ChevronRight size={16} /></Link>
          </div>
        </SectionHeader>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {trending.map((p, i) => (
            <ProductCard key={p._id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
};

const WhyChooseUsSection = () => {
  const features = [
    { icon: Clock, title: "10 Min Delivery", desc: "Get groceries delivered in as fast as 10 minutes" },
    { icon: Shield, title: "Quality Guaranteed", desc: "100% fresh or your money back guarantee" },
    { icon: Truck, title: "Free Delivery", desc: "Free delivery on all orders above ₹500" },
    { icon: Zap, title: "Best Prices", desc: "We match prices with any local competitor" },
  ];
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <SectionHeader>
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">Why Choose Freshly?</h2>
            <p className="text-muted-foreground max-w-md mx-auto">We're redefining grocery shopping with speed, quality, and convenience.</p>
          </div>
        </SectionHeader>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="glass-card-solid hover-lift p-6 text-center">
              <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
                <f.icon size={22} className="text-primary-foreground" />
              </div>
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AppDownloadSection = () => {
  const { ref, isInView } = useScrollReveal();
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}>
          <div className="gradient-primary rounded-3xl p-8 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-primary-foreground max-w-lg">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Get the Freshly App</h2>
              <p className="text-primary-foreground/80 mb-6">Download now and get ₹100 off your first order. Experience grocery shopping like never before.</p>
              <div className="flex gap-3">
                <button className="bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground px-6 py-3 rounded-2xl font-semibold text-sm flex items-center gap-2 hover:bg-primary-foreground/30 transition-colors">
                  <Download size={18} /> App Store
                </button>
                <button className="bg-primary-foreground/20 backdrop-blur-sm text-primary-foreground px-6 py-3 rounded-2xl font-semibold text-sm flex items-center gap-2 hover:bg-primary-foreground/30 transition-colors">
                  <Download size={18} /> Play Store
                </button>
              </div>
            </div>
            <div className="w-48 h-48 rounded-3xl bg-primary-foreground/10 flex items-center justify-center">
              <span className="text-6xl">📱</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    let mounted = true;
    Promise.all([api.productsPublic(), api.categoriesPublic()])
      .then(([prodData, catData]) => {
        if (!mounted) return;
        setProducts(prodData.products);
        setCategories(catData.categories);
      })
      .catch(() => {
        if (!mounted) return;
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="pb-16 md:pb-0">
      <HeroSection />
      <CategoriesSection categories={categories} />
      <FlashDealsSection products={products} />
      <TrendingSection products={products} />
      <WhyChooseUsSection />
      <AppDownloadSection />
    </div>
  );
};

export default Index;
