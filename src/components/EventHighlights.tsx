import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Wand2, Palette, Trophy, Calendar, MapPin, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Event } from '../types';

const iconMap: Record<string, any> = {
  star: Star,
  'wand-sparkles': Wand2,
  palette: Palette,
  trophy: Trophy,
  calendar: Calendar,
};

export function EventHighlights() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_featured', true)
        .order('event_date', { ascending: true });

      if (!error && data) {
        setEvents(data);
      }
      setLoading(false);
    }

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <section id="events" className="py-16 bg-neutral-light">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-neutral-dark">Loading amazing events...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="events" className="py-16 md:py-24 bg-neutral-light">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-neutral-dark mb-4">
            Event Highlights
          </h2>
          <p className="text-lg md:text-xl text-neutral-dark/80 max-w-2xl mx-auto">
            Don't miss these spectacular moments of joy and celebration!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {events.map((event, index) => {
            const Icon = iconMap[event.icon] || Star;
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-shadow"
              >
                <div className="bg-gradient-to-br from-primary to-secondary rounded-2xl w-16 h-16 flex items-center justify-center mb-4">
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-display font-bold text-neutral-dark mb-2">{event.title}</h3>
                <p className="text-neutral-dark/70 mb-4 line-clamp-2">{event.description}</p>
                <div className="space-y-2 text-sm text-neutral-dark/60">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <span>{new Date(event.event_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-secondary" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-accent" />
                    <span>Up to {event.capacity} attendees</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
