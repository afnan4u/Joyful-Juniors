import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Download, X, Sparkles } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { GalleryItem, CardTemplate } from '../types';

export function Gallery() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [cardTemplates, setCardTemplates] = useState<CardTemplate[]>([]);
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [showCardMaker, setShowCardMaker] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CardTemplate | null>(null);
  const [cardMessage, setCardMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGallery() {
      const { data: gallery } = await supabase
        .from('gallery_items')
        .select('*')
        .eq('is_approved', true)
        .order('created_at', { ascending: false })
        .limit(12);

      const { data: templates } = await supabase
        .from('card_templates')
        .select('*')
        .order('created_at', { ascending: true });

      if (gallery) setGalleryItems(gallery);
      if (templates && templates.length > 0) {
        setCardTemplates(templates);
        setSelectedTemplate(templates[0]);
      }
      setLoading(false);
    }

    fetchGallery();
  }, []);

  const handleLike = async (item: GalleryItem) => {
    await supabase
      .from('gallery_items')
      .update({ likes_count: item.likes_count + 1 })
      .eq('id', item.id);

    setGalleryItems(
      galleryItems.map((i) => (i.id === item.id ? { ...i, likes_count: i.likes_count + 1 } : i))
    );
  };

  const downloadCard = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      const gradient = ctx.createLinearGradient(0, 0, 600, 400);
      gradient.addColorStop(0, '#FFD54A');
      gradient.addColorStop(0.5, '#56CCF2');
      gradient.addColorStop(1, '#FF6B6B');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 600, 400);

      ctx.fillStyle = '#263238';
      ctx.font = 'bold 32px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Joyful Juniors', 300, 80);

      ctx.font = '24px Arial';
      ctx.fillStyle = '#FFFFFF';
      const lines = cardMessage.split('\n');
      lines.forEach((line, index) => {
        ctx.fillText(line, 300, 180 + index * 40);
      });

      ctx.font = '18px Arial';
      ctx.fillStyle = '#263238';
      ctx.fillText("Children's Day 2025", 300, 350);

      const link = document.createElement('a');
      link.download = 'joyful-juniors-card.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  if (loading) {
    return (
      <section id="gallery" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-neutral-dark">Loading gallery...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-16 md:py-24 bg-neutral-light">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-neutral-dark mb-4">
            Gallery & Share
          </h2>
          <p className="text-lg md:text-xl text-neutral-dark/80 max-w-2xl mx-auto mb-8">
            Explore joyful moments and create your own celebration card!
          </p>
          <motion.button
            onClick={() => setShowCardMaker(!showCardMaker)}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-neutral-dark font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-primary"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Sparkles className="w-5 h-5" />
            <span>Make a Card</span>
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {showCardMaker && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 shadow-xl mb-12 overflow-hidden"
            >
              <h3 className="text-2xl font-display font-bold text-neutral-dark mb-6">
                Create Your Celebration Card
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-neutral-dark mb-4">Choose a Template</h4>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {cardTemplates.map((template) => (
                      <motion.button
                        key={template.id}
                        onClick={() => setSelectedTemplate(template)}
                        className={`p-4 rounded-2xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                          selectedTemplate?.id === template.id
                            ? 'border-primary bg-primary/10'
                            : 'border-neutral hover:border-neutral-dark'
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="aspect-video bg-gradient-to-br from-primary via-secondary to-accent rounded-lg mb-2" />
                        <p className="text-sm font-semibold text-neutral-dark">{template.name}</p>
                      </motion.button>
                    ))}
                  </div>

                  <h4 className="text-lg font-semibold text-neutral-dark mb-4">Your Message</h4>
                  <textarea
                    value={cardMessage}
                    onChange={(e) => setCardMessage(e.target.value)}
                    placeholder="Write your message here..."
                    className="w-full h-32 px-4 py-3 border border-neutral rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    maxLength={150}
                  />
                  <p className="text-sm text-neutral-dark/60 mt-2">{cardMessage.length}/150 characters</p>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-neutral-dark mb-4">Preview</h4>
                  <div className="bg-gradient-to-br from-primary via-secondary to-accent rounded-2xl p-8 aspect-video flex flex-col items-center justify-center text-center">
                    <h3 className="text-2xl font-display font-bold text-neutral-dark mb-4">
                      Joyful Juniors
                    </h3>
                    <p className="text-white text-lg font-medium mb-4 whitespace-pre-line">
                      {cardMessage || 'Your message will appear here...'}
                    </p>
                    <p className="text-neutral-dark text-sm font-semibold">Children's Day 2025</p>
                  </div>

                  <motion.button
                    onClick={downloadCard}
                    disabled={!cardMessage.trim()}
                    className={`w-full mt-6 inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-accent ${
                      cardMessage.trim()
                        ? 'bg-gradient-to-r from-accent to-accent-dark text-white hover:shadow-lg'
                        : 'bg-neutral text-neutral-dark/50 cursor-not-allowed'
                    }`}
                    whileHover={cardMessage.trim() ? { scale: 1.02, y: -2 } : {}}
                    whileTap={cardMessage.trim() ? { scale: 0.98 } : {}}
                  >
                    <Download className="w-5 h-5" />
                    <span>Download Card</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
            >
              <div className="relative aspect-square">
                <img
                  src={item.image_url}
                  alt={item.caption}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => setSelectedImage(item)}
                  loading="lazy"
                />
                <motion.button
                  onClick={() => handleLike(item)}
                  className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Heart className="w-5 h-5 text-accent fill-accent" />
                </motion.button>
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-neutral-dark mb-1">{item.uploaded_by}</p>
                <p className="text-sm text-neutral-dark/70 line-clamp-2">{item.caption}</p>
                <div className="flex items-center space-x-1 mt-2 text-accent">
                  <Heart className="w-4 h-4 fill-accent" />
                  <span className="text-sm font-semibold">{item.likes_count}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {galleryItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-xl text-neutral-dark/70">
              No photos yet. Be the first to share your joyful moment!
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              >
                <X className="w-6 h-6 text-white" />
              </button>
              <img
                src={selectedImage.image_url}
                alt={selectedImage.caption}
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="bg-white rounded-b-2xl p-6">
                <p className="font-semibold text-neutral-dark mb-2">{selectedImage.uploaded_by}</p>
                <p className="text-neutral-dark/70">{selectedImage.caption}</p>
                <div className="flex items-center space-x-2 mt-4 text-accent">
                  <Heart className="w-5 h-5 fill-accent" />
                  <span className="font-semibold">{selectedImage.likes_count} likes</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
