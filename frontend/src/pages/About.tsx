import { motion } from 'framer-motion';
import { Target, Eye, Rocket, Users } from 'lucide-react';

const timeline = [
  { year: '2023', title: 'The Spark', desc: 'Founded with a mission to revolutionize grocery delivery in urban areas.' },
  { year: '2024', title: 'Rapid Growth', desc: 'Expanded to 10 cities, serving over 500,000 happy customers.' },
  { year: '2025', title: 'Innovation', desc: 'Launched AI-powered inventory and 10-minute delivery guarantee.' },
  { year: '2026', title: 'Today', desc: 'Serving millions across 50+ cities with the freshest produce.' },
];

const team = [
  { name: 'Alex Rivera', role: 'CEO & Founder', emoji: '👨‍💼' },
  { name: 'Sarah Chen', role: 'CTO', emoji: '👩‍💻' },
  { name: 'Marcus Kim', role: 'Head of Operations', emoji: '👨‍🔧' },
  { name: 'Priya Patel', role: 'Head of Design', emoji: '👩‍🎨' },
];

const About = () => (
  <div className="pt-24 pb-24 md:pb-8">
    <div className="container mx-auto px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto mb-16">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">About Freshly</h1>
        <p className="text-muted-foreground text-lg">We're on a mission to make fresh groceries accessible to everyone, delivered in minutes.</p>
      </motion.div>

      {/* Mission/Vision */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {[
          { icon: Target, title: 'Our Mission', text: 'To deliver the freshest groceries to every doorstep within minutes, making healthy eating effortless and accessible for all.' },
          { icon: Eye, title: 'Our Vision', text: 'A world where fresh, quality groceries are just a tap away — no compromises on freshness, price, or convenience.' },
        ].map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card-solid p-8"
          >
            <div className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center mb-4">
              <item.icon size={22} className="text-primary-foreground" />
            </div>
            <h3 className="font-bold text-xl mb-2">{item.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{item.text}</p>
          </motion.div>
        ))}
      </div>

      {/* Timeline */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-center mb-10">Our Journey</h2>
        <div className="grid md:grid-cols-4 gap-5">
          {timeline.map((item, i) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card-solid p-6 text-center relative"
            >
              <div className="text-2xl font-extrabold text-gradient-primary mb-2">{item.year}</div>
              <h3 className="font-bold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div>
        <h2 className="text-2xl font-bold text-center mb-10">Meet the Team</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {team.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card-solid p-6 text-center hover-lift"
            >
              <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3 text-3xl">{member.emoji}</div>
              <h3 className="font-semibold text-sm">{member.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default About;
