import { Link, useLocation } from 'react-router-dom';
import { Home, Grid3X3, ShoppingBag, User, Search } from 'lucide-react';

const tabs = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Search, label: 'Search', path: '/products' },
  { icon: Grid3X3, label: 'Categories', path: '/categories' },
  { icon: ShoppingBag, label: 'Orders', path: '/products' },
  { icon: User, label: 'Account', path: '/about' },
];

const MobileNav = () => {
  const location = useLocation();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-navbar border-t border-border/50">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map(tab => {
          const active = location.pathname === tab.path;
          return (
            <Link
              key={tab.label}
              to={tab.path}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-colors ${active ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <tab.icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNav;
