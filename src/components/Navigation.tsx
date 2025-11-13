import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Heart, Sparkles } from 'lucide-react';

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const navItems = [
    { label: 'About', id: 'hero' },
    { label: 'Activities', id: 'activities' },
    { label: 'Gallery', id: 'gallery' },
    { label: 'Volunteer', id: 'volunteer' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <motion.div
            className="flex items-center space-x-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => scrollToSection('hero')}
          >
            <Sparkles className="w-8 h-8 text-primary" />
            <span className="text-xl lg:text-2xl font-display font-bold text-neutral-dark">
              Joyful Juniors
            </span>
          </motion.div>

          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="px-3 lg:px-4 py-2 text-sm lg:text-base font-medium text-neutral-dark hover:text-primary transition-colors rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {item.label}
              </motion.button>
            ))}
          </div>

          <div className="hidden md:block">
            <motion.button
              onClick={() => scrollToSection('volunteer')}
              className="inline-flex items-center space-x-2 px-4 lg:px-6 py-2 lg:py-3 bg-gradient-to-r from-accent to-accent-dark text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Heart className="w-4 h-4 lg:w-5 lg:h-5" />
              <span className="text-sm lg:text-base">Donate / Sponsor</span>
            </motion.button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-neutral-dark hover:bg-neutral-light focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-neutral overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-4 py-3 text-base font-medium text-neutral-dark hover:bg-neutral-light rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={() => scrollToSection('volunteer')}
                className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gradient-to-r from-accent to-accent-dark text-white font-semibold rounded-xl shadow-lg focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <Heart className="w-5 h-5" />
                <span>Donate / Sponsor</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
