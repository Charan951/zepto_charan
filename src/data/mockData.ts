export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  discount: number;
  rating: number;
  weight: string;
  image: string;
  description: string;
  nutrition: { label: string; value: string }[];
  inStock: boolean;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
  count: number;
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  category: string;
  readTime: string;
}

export const categories: Category[] = [
  { id: 1, name: "Fruits & Vegetables", icon: "🥬", color: "hsl(120, 50%, 92%)", count: 156 },
  { id: 2, name: "Dairy & Eggs", icon: "🥛", color: "hsl(45, 80%, 92%)", count: 89 },
  { id: 3, name: "Snacks", icon: "🍿", color: "hsl(15, 80%, 92%)", count: 234 },
  { id: 4, name: "Beverages", icon: "🥤", color: "hsl(200, 70%, 92%)", count: 178 },
  { id: 5, name: "Personal Care", icon: "🧴", color: "hsl(300, 50%, 92%)", count: 145 },
  { id: 6, name: "Household", icon: "🏠", color: "hsl(30, 60%, 92%)", count: 98 },
  { id: 7, name: "Bakery", icon: "🍞", color: "hsl(35, 80%, 92%)", count: 67 },
  { id: 8, name: "Meat & Fish", icon: "🥩", color: "hsl(0, 60%, 92%)", count: 112 },
];

export const products: Product[] = [
  {
    id: 1, name: "Organic Bananas", category: "Fruits & Vegetables", price: 2.49, originalPrice: 3.49, discount: 29,
    rating: 4.8, weight: "1 bunch (~6pcs)", image: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop",
    description: "Fresh organic bananas sourced from sustainable farms. Perfect for smoothies, baking, or a quick healthy snack.",
    nutrition: [{ label: "Calories", value: "89 kcal" }, { label: "Carbs", value: "23g" }, { label: "Fiber", value: "2.6g" }, { label: "Potassium", value: "358mg" }],
    inStock: true
  },
  {
    id: 2, name: "Fresh Strawberries", category: "Fruits & Vegetables", price: 4.99, originalPrice: 6.99, discount: 29,
    rating: 4.9, weight: "250g pack", image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=400&fit=crop",
    description: "Juicy, ripe strawberries picked at peak freshness. Rich in vitamin C and antioxidants.",
    nutrition: [{ label: "Calories", value: "32 kcal" }, { label: "Vitamin C", value: "59mg" }, { label: "Fiber", value: "2g" }, { label: "Sugar", value: "4.9g" }],
    inStock: true
  },
  {
    id: 3, name: "Greek Yogurt", category: "Dairy & Eggs", price: 3.99, originalPrice: 4.99, discount: 20,
    rating: 4.7, weight: "500g", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop",
    description: "Thick, creamy Greek yogurt packed with protein. Perfect for breakfast or as a healthy snack.",
    nutrition: [{ label: "Calories", value: "97 kcal" }, { label: "Protein", value: "17g" }, { label: "Calcium", value: "110mg" }, { label: "Fat", value: "0.7g" }],
    inStock: true
  },
  {
    id: 4, name: "Almond Milk", category: "Beverages", price: 3.49, originalPrice: 4.49, discount: 22,
    rating: 4.5, weight: "1L", image: "https://images.unsplash.com/photo-1600788886242-5c96aabe3757?w=400&h=400&fit=crop",
    description: "Smooth unsweetened almond milk. Dairy-free, low in calories, and rich in vitamin E.",
    nutrition: [{ label: "Calories", value: "13 kcal" }, { label: "Fat", value: "1.1g" }, { label: "Calcium", value: "184mg" }, { label: "Vitamin E", value: "6.3mg" }],
    inStock: true
  },
  {
    id: 5, name: "Sourdough Bread", category: "Bakery", price: 5.49, originalPrice: 6.99, discount: 21,
    rating: 4.8, weight: "400g loaf", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
    description: "Artisan sourdough bread with a perfectly crispy crust and soft, tangy interior.",
    nutrition: [{ label: "Calories", value: "185 kcal" }, { label: "Carbs", value: "36g" }, { label: "Protein", value: "7g" }, { label: "Fiber", value: "2g" }],
    inStock: true
  },
  {
    id: 6, name: "Avocados", category: "Fruits & Vegetables", price: 1.99, originalPrice: 2.99, discount: 33,
    rating: 4.6, weight: "2 pcs", image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=400&h=400&fit=crop",
    description: "Perfectly ripe Hass avocados. Great for guacamole, toast, or salads.",
    nutrition: [{ label: "Calories", value: "160 kcal" }, { label: "Fat", value: "15g" }, { label: "Fiber", value: "7g" }, { label: "Potassium", value: "485mg" }],
    inStock: true
  },
  {
    id: 7, name: "Mixed Nuts Trail", category: "Snacks", price: 7.99, originalPrice: 9.99, discount: 20,
    rating: 4.7, weight: "300g", image: "https://images.unsplash.com/photo-1599599810694-b5b37304c041?w=400&h=400&fit=crop",
    description: "Premium mix of almonds, cashews, walnuts, and dried cranberries. A perfect on-the-go snack.",
    nutrition: [{ label: "Calories", value: "607 kcal" }, { label: "Protein", value: "20g" }, { label: "Fat", value: "54g" }, { label: "Fiber", value: "7g" }],
    inStock: true
  },
  {
    id: 8, name: "Fresh Orange Juice", category: "Beverages", price: 4.49, originalPrice: 5.99, discount: 25,
    rating: 4.8, weight: "1L", image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop",
    description: "100% freshly squeezed orange juice with no added sugar. Pure citrus goodness.",
    nutrition: [{ label: "Calories", value: "45 kcal" }, { label: "Vitamin C", value: "50mg" }, { label: "Sugar", value: "8g" }, { label: "Potassium", value: "200mg" }],
    inStock: true
  },
  {
    id: 9, name: "Free Range Eggs", category: "Dairy & Eggs", price: 5.99, originalPrice: 7.49, discount: 20,
    rating: 4.9, weight: "12 pcs", image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop",
    description: "Farm-fresh free range eggs from happy hens. Rich in protein and essential nutrients.",
    nutrition: [{ label: "Calories", value: "72 kcal" }, { label: "Protein", value: "6g" }, { label: "Fat", value: "5g" }, { label: "Vitamin D", value: "1mcg" }],
    inStock: true
  },
  {
    id: 10, name: "Baby Spinach", category: "Fruits & Vegetables", price: 3.29, originalPrice: 4.29, discount: 23,
    rating: 4.5, weight: "200g", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop",
    description: "Tender baby spinach leaves, pre-washed and ready to eat. Great for salads and smoothies.",
    nutrition: [{ label: "Calories", value: "23 kcal" }, { label: "Iron", value: "2.7mg" }, { label: "Vitamin A", value: "469mcg" }, { label: "Vitamin K", value: "483mcg" }],
    inStock: true
  },
  {
    id: 11, name: "Dark Chocolate Bar", category: "Snacks", price: 3.99, originalPrice: 5.49, discount: 27,
    rating: 4.8, weight: "100g", image: "https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400&h=400&fit=crop",
    description: "72% cacao dark chocolate made from ethically sourced cocoa beans. Rich and smooth.",
    nutrition: [{ label: "Calories", value: "546 kcal" }, { label: "Fat", value: "31g" }, { label: "Iron", value: "8mg" }, { label: "Fiber", value: "7g" }],
    inStock: true
  },
  {
    id: 12, name: "Sparkling Water", category: "Beverages", price: 1.49, originalPrice: 1.99, discount: 25,
    rating: 4.4, weight: "500ml", image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400&h=400&fit=crop",
    description: "Naturally carbonated mineral water. Zero calories, refreshing taste.",
    nutrition: [{ label: "Calories", value: "0 kcal" }, { label: "Sodium", value: "5mg" }, { label: "Calcium", value: "80mg" }, { label: "Magnesium", value: "26mg" }],
    inStock: true
  },
];

export const blogPosts: BlogPost[] = [
  {
    id: 1, title: "10 Superfoods You Should Add to Your Diet",
    excerpt: "Discover the top superfoods that can boost your health and energy levels naturally.",
    author: "Dr. Sarah Chen", date: "Feb 15, 2026", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
    category: "Nutrition", readTime: "5 min read"
  },
  {
    id: 2, title: "Quick & Healthy Meal Prep Ideas",
    excerpt: "Save time and eat better with these simple meal preparation strategies for busy weeks.",
    author: "Chef Marco", date: "Feb 12, 2026", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=400&fit=crop",
    category: "Recipes", readTime: "7 min read"
  },
  {
    id: 3, title: "Sustainable Shopping: A Beginner's Guide",
    excerpt: "Learn how to reduce your environmental impact with smarter grocery shopping habits.",
    author: "Emma Green", date: "Feb 8, 2026", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&h=400&fit=crop",
    category: "Sustainability", readTime: "6 min read"
  },
  {
    id: 4, title: "The Benefits of Eating Seasonal Produce",
    excerpt: "Why seasonal fruits and vegetables are better for your health, wallet, and the planet.",
    author: "Dr. Sarah Chen", date: "Feb 5, 2026", image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&h=400&fit=crop",
    category: "Nutrition", readTime: "4 min read"
  },
];

export const faqs = [
  { q: "How fast is delivery?", a: "We deliver in as fast as 10 minutes! Our average delivery time is 12-15 minutes depending on your location and order size." },
  { q: "What are the delivery charges?", a: "Delivery is free on orders above $15. For orders below $15, a flat delivery fee of $2.99 applies." },
  { q: "Can I return products?", a: "Yes! We have a no-questions-asked return policy. If you're not satisfied with any product, we'll refund you instantly or replace it on your next order." },
  { q: "What payment methods do you accept?", a: "We accept all major credit/debit cards, digital wallets (Apple Pay, Google Pay), and cash on delivery." },
  { q: "How do I track my order?", a: "Once your order is confirmed, you'll receive real-time tracking updates via the app. You can see your delivery partner's live location." },
  { q: "Are the products fresh?", a: "Absolutely! We source directly from local farms and trusted suppliers. Our cold chain ensures products stay fresh from warehouse to your door." },
  { q: "Do you offer subscription plans?", a: "Yes! Our FreshPass subscription gives you free delivery, exclusive discounts, and early access to deals for just $4.99/month." },
];
