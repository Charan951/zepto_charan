import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="pt-24 pb-24 md:pb-8">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-muted-foreground text-lg">Have a question or feedback? We'd love to hear from you.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card-solid p-8">
            {submitted ? (
              <div className="text-center py-10">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="font-bold text-xl mb-2">Message Sent!</h3>
                <p className="text-muted-foreground text-sm">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-5">
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Name</label>
                  <input required type="text" className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20" placeholder="Your name" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Email</label>
                  <input required type="email" className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20" placeholder="you@example.com" />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1.5 block">Message</label>
                  <textarea required rows={4} className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm outline-none focus:ring-2 focus:ring-primary/20 resize-none" placeholder="Tell us what's on your mind..." />
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full gradient-primary text-primary-foreground py-3.5 rounded-2xl font-semibold flex items-center justify-center gap-2"
                >
                  <Send size={16} /> Send Message
                </motion.button>
              </form>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {[
              { icon: Mail, label: 'Email', value: 'hello@freshly.app' },
              { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
              { icon: MapPin, label: 'Address', value: '123 Fresh Street, New York, NY 10001' },
            ].map(item => (
              <div key={item.label} className="glass-card-solid p-5 flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
                  <item.icon size={18} className="text-primary-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="font-medium text-sm">{item.value}</p>
                </div>
              </div>
            ))}

            <div className="glass-card-solid overflow-hidden rounded-2xl h-52">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.25280949!2d-74.11976373946229!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1"
                className="w-full h-full border-0"
                loading="lazy"
                title="Map"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
