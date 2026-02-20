import { Link } from 'react-router-dom';
import { Instagram, Twitter, Facebook, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => (
  <footer className="bg-foreground text-primary-foreground/80 mt-20">
    <div className="container mx-auto px-4 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">F</span>
            </div>
            <span className="font-bold text-xl text-primary-foreground">Freshly</span>
          </div>
          <p className="text-sm leading-relaxed opacity-70">Delivering fresh groceries to your doorstep in minutes. Quality you can trust, speed you'll love.</p>
          <div className="flex gap-3 mt-5">
            {[Instagram, Twitter, Facebook].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-xl bg-primary-foreground/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-primary-foreground mb-4">Quick Links</h4>
          <div className="flex flex-col gap-2.5">
            {[{ l: 'Products', p: '/products' }, { l: 'Categories', p: '/categories' }, { l: 'Blog', p: '/blog' }, { l: 'FAQ', p: '/faq' }].map(item => (
              <Link key={item.p} to={item.p} className="text-sm opacity-70 hover:opacity-100 hover:text-primary transition-all">{item.l}</Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-primary-foreground mb-4">Company</h4>
          <div className="flex flex-col gap-2.5">
            {[{ l: 'About Us', p: '/about' }, { l: 'Contact', p: '/contact' }, { l: 'Careers', p: '#' }, { l: 'Privacy Policy', p: '#' }].map(item => (
              <Link key={item.l} to={item.p} className="text-sm opacity-70 hover:opacity-100 hover:text-primary transition-all">{item.l}</Link>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-primary-foreground mb-4">Contact</h4>
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm opacity-70"><Mail size={14} /> hello@freshly.app</div>
            <div className="flex items-center gap-2 text-sm opacity-70"><Phone size={14} /> +1 (555) 123-4567</div>
            <div className="flex items-center gap-2 text-sm opacity-70"><MapPin size={14} /> New York, NY 10001</div>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-sm opacity-50">
        © 2026 Freshly. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
