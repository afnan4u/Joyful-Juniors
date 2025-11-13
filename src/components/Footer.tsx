import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Eye, Type } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAccessibility } from '../contexts/AccessibilityContext';
import { useState } from 'react';

export function Footer() {
  const { highContrast, largeText, toggleHighContrast, toggleLargeText } = useAccessibility();
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Is registration required?',
      a: 'Yes, for workshops and activities. Event entry is free for all!',
    },
    {
      q: 'What age groups can participate?',
      a: 'We have activities for ages 4-12, categorized by age groups.',
    },
    {
      q: 'Are parents allowed to accompany?',
      a: 'Absolutely! Parents are welcome and encouraged to join.',
    },
    {
      q: 'Is food provided?',
      a: 'Light snacks and refreshments will be available throughout the day.',
    },
  ];

  return (
    <footer className="bg-neutral-dark text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-display font-bold text-primary mb-4">Joyful Juniors</h3>
            <p className="text-gray-300 mb-4">
              Creating magical memories for children and families through fun, learning, and celebration.
            </p>
            <div className="flex space-x-4">
              <motion.a
                href="#"
                aria-label="Facebook"
                className="text-gray-300 hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Facebook className="w-6 h-6" />
              </motion.a>
              <motion.a
                href="#"
                aria-label="Twitter"
                className="text-gray-300 hover:text-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-secondary rounded"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Twitter className="w-6 h-6" />
              </motion.a>
              <motion.a
                href="#"
                aria-label="Instagram"
                className="text-gray-300 hover:text-accent transition-colors focus:outline-none focus:ring-2 focus:ring-accent rounded"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Instagram className="w-6 h-6" />
              </motion.a>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-gray-300">
              <div className="flex items-start space-x-2">
                <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>hello@joyfaljuniors.org</span>
              </div>
              <div className="flex items-start space-x-2">
                <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                <span>123 Joy Street, Happytown, HT 12345</span>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Quick FAQ</h4>
            <div className="space-y-2">
              {faqs.map((faq, index) => (
                <div key={index}>
                  <button
                    onClick={() => setFaqOpen(faqOpen === index ? null : index)}
                    className="text-left text-gray-300 hover:text-white transition-colors focus:outline-none focus:text-primary w-full"
                  >
                    <span className="font-medium">{faq.q}</span>
                  </button>
                  {faqOpen === index && (
                    <p className="text-sm text-gray-400 mt-1 pl-4">{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold mb-4">Accessibility</h4>
            <div className="space-y-3">
              <motion.button
                onClick={toggleHighContrast}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg w-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                  highContrast ? 'bg-primary text-neutral-dark' : 'bg-neutral/20 text-gray-300 hover:bg-neutral/30'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Eye className="w-5 h-5" />
                <span className="text-sm font-medium">High Contrast</span>
              </motion.button>
              <motion.button
                onClick={toggleLargeText}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg w-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                  largeText ? 'bg-secondary text-neutral-dark' : 'bg-neutral/20 text-gray-300 hover:bg-neutral/30'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Type className="w-5 h-5" />
                <span className="text-sm font-medium">Larger Text</span>
              </motion.button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Joyful Juniors. All rights reserved. Made with love for children everywhere.</p>
        </div>
      </div>
    </footer>
  );
}
