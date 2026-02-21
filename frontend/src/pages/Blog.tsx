import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogPosts } from '@/data/mockData';

const Blog = () => (
  <div className="pt-24 pb-24 md:pb-8">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Fresh from the Blog</h1>
        <p className="text-muted-foreground text-lg">Tips, recipes, and stories to help you eat better</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {blogPosts.map((post, i) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card-solid overflow-hidden hover-lift group"
          >
            <div className="overflow-hidden">
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            <div className="p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-medium bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">{post.category}</span>
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock size={12} /> {post.readTime}</span>
              </div>
              <h2 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h2>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">{post.author}</span> · {post.date}
                </div>
                <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  </div>
);

export default Blog;
