import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, ChevronDown, Search } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { api, Product, Category } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

const sortOptions = ["Recommended", "Price: Low to High", "Price: High to Low", "Rating"];

interface FiltersPanelProps {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (value: string) => void;
  maxPrice: number;
  maxPriceLimit: number;
  setMaxPrice: (value: number) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
}

const FiltersPanel = ({
  categories,
  selectedCategory,
  setSelectedCategory,
  maxPrice,
  maxPriceLimit,
  setMaxPrice,
  sortBy,
  setSortBy,
}: FiltersPanelProps) => (
  <div className="space-y-6">
    <div>
      <h3 className="font-semibold mb-3 flex items-center gap-2">
        <SlidersHorizontal size={16} /> Filters
      </h3>
      <div className="space-y-2">
        <button
          onClick={() => setSelectedCategory("All")}
          className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
            selectedCategory === "All" ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"
          }`}
        >
          All Products
        </button>
        {categories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => setSelectedCategory(cat.name)}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors flex items-center gap-2 ${
              selectedCategory === cat.name ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <span>{cat.name}</span>
          </button>
        ))}
      </div>
    </div>

    <div>
      <h4 className="font-semibold text-sm mb-3">Price Range</h4>
      <input
        type="range"
        min={0}
        max={maxPriceLimit || 20}
        step={0.5}
        value={maxPrice}
        onChange={(e) => setMaxPrice(Number(e.target.value))}
        className="w-full accent-primary"
      />
      <div className="flex justify-between text-xs text-muted-foreground mt-1">
        <span>₹0</span>
        <span>₹{maxPrice.toFixed(2)}</span>
      </div>
    </div>

    <div>
      <h4 className="font-semibold text-sm mb-3">Sort By</h4>
      <div className="space-y-1">
        {sortOptions.map((opt) => (
          <button
            key={opt}
            onClick={() => setSortBy(opt)}
            className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
              sortBy === opt ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  </div>
);

const Products = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("Recommended");
  const [maxPrice, setMaxPrice] = useState(0);
  const [maxPriceLimit, setMaxPriceLimit] = useState(0);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const productsQuery = useQuery({
    queryKey: ["productsPublic"],
    queryFn: api.productsPublic,
    staleTime: 1000 * 60,
  });

  const categoriesQuery = useQuery({
    queryKey: ["categoriesPublic"],
    queryFn: api.categoriesPublic,
    staleTime: 1000 * 60 * 5,
  });

  const productsData = productsQuery.data?.products as Product[] | undefined;
  const categories = (categoriesQuery.data?.categories as Category[]) || [];
  const loading = productsQuery.isLoading || categoriesQuery.isLoading;
  const error =
    ((productsQuery.error as Error | null)?.message ||
      (categoriesQuery.error as Error | null)?.message) ??
    null;

  useEffect(() => {
    if (!productsData?.length) return;
    const highestPrice = productsData.reduce((max, p) => (p.price > max ? p.price : max), 0);
    const limit = highestPrice > 0 ? Math.ceil(highestPrice / 10) * 10 : 20;
    setMaxPriceLimit(limit);
    setMaxPrice(limit);
  }, [productsData]);

  const filtered = useMemo(() => {
    const source = productsData || [];
    let result = source.filter((p) => p.price <= maxPrice);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    if (selectedCategory !== "All") {
      result = result.filter((p) => {
        if (!p.category) return false;
        if (typeof p.category === "string") return false;
        return p.category.name === selectedCategory;
      });
    }
    if (sortBy === "Price: Low to High") result = [...result].sort((a, b) => a.price - b.price);
    if (sortBy === "Price: High to Low") result = [...result].sort((a, b) => b.price - a.price);
    return result;
  }, [productsData, selectedCategory, sortBy, maxPrice, searchQuery]);

  return (
    <div className="pt-24 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold mb-2">Fresh Products</h1>
          <p className="text-muted-foreground mb-4">Browse our selection of premium groceries</p>
        </motion.div>

        {error && (
          <div className="mb-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Search + filters row */}
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex-1 relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="sm:w-auto lg:hidden">
            <button
              type="button"
              onClick={() => setFiltersOpen((v) => !v)}
              className="w-full sm:w-auto flex items-center justify-between sm:justify-center gap-2 rounded-2xl glass-card-solid px-4 py-2.5 text-sm font-medium"
            >
              <SlidersHorizontal size={16} /> Filters
              <ChevronDown
                size={16}
                className={`transition-transform ${filtersOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Mobile filters dropdown content */}
        {filtersOpen && (
          <div className="mb-6 glass-card-solid p-4 lg:hidden">
            <FiltersPanel
              categories={categories}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              maxPrice={maxPrice}
              maxPriceLimit={maxPriceLimit}
              setMaxPrice={setMaxPrice}
              sortBy={sortBy}
              setSortBy={setSortBy}
            />
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar (desktop) */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block lg:w-64 flex-shrink-0"
          >
            <div className="glass-card-solid p-5 sticky top-24">
              <FiltersPanel
                categories={categories}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                maxPrice={maxPrice}
                maxPriceLimit={maxPriceLimit}
                setMaxPrice={setMaxPrice}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
            </div>
          </motion.aside>

          {/* Products grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-muted-foreground">
                {loading ? "Loading products..." : `${filtered.length} products found`}
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {filtered.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
            {!loading && filtered.length === 0 && (
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
