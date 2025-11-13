import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Users, Sparkles } from 'lucide-react';

export function Hero() {
  const [confetti, setConfetti] = useState<Array<{ id: number; left: string; delay: number; duration: number }>>([]);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: Math.random() * 2,
      duration: 3 + Math.random() * 2,
    }));
    setConfetti(confettiPieces);

    const interval = setInterval(() => {
      const newConfetti = Array.from({ length: 50 }, (_, i) => ({
        id: Date.now() + i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 2,
        duration: 3 + Math.random() * 2,
      }));
      setConfetti(newConfetti);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const targetDate = new Date('2025-11-15T09:00:00').getTime();

    const updateCountdown = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);

    return () => clearInterval(timer);
  }, []);

  const scrollToActivities = () => {
    document.getElementById('activities')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary-light via-secondary-light to-accent-light pt-20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {confetti.map((piece) => (
          <motion.div
            key={piece.id}
            className="absolute w-3 h-3 rounded-full"
            style={{
              left: piece.left,
              top: '-20px',
              backgroundColor: ['#FFD54A', '#56CCF2', '#FF6B6B', '#FF9999', '#84E1FF'][Math.floor(Math.random() * 5)],
            }}
            animate={{
              y: '100vh',
              rotate: 720,
              opacity: [1, 0],
            }}
            transition={{
              duration: piece.duration,
              delay: piece.delay,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="inline-block mb-6"
          >
            <Sparkles className="w-16 h-16 md:w-20 md:h-20 text-primary animate-float" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-neutral-dark mb-6 leading-tight"
          >
            Welcome to
            <span className="block text-primary">Joyful Juniors!</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl md:text-2xl text-neutral-dark mb-8 font-medium max-w-2xl mx-auto"
          >
            A magical Children's Day celebration filled with joy, laughter, and unforgettable memories!
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 md:p-8 mb-8 shadow-2xl"
          >
            <h2 className="text-xl md:text-2xl font-display font-semibold text-neutral-dark mb-4">
              Event Starts In:
            </h2>
            <div className="grid grid-cols-4 gap-3 md:gap-6 max-w-xl mx-auto">
              {[
                { value: timeLeft.days, label: 'Days' },
                { value: timeLeft.hours, label: 'Hours' },
                { value: timeLeft.minutes, label: 'Mins' },
                { value: timeLeft.seconds, label: 'Secs' },
              ].map((item, index) => (
                <div key={index} className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-3 md:p-4">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-neutral-dark">
                    {String(item.value).padStart(2, '0')}
                  </div>
                  <div className="text-xs md:text-sm font-semibold text-neutral-dark/80">{item.label}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
          >
            <motion.button
              onClick={scrollToActivities}
              className="px-8 py-4 bg-gradient-to-r from-accent to-accent-dark text-white text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-shadow focus:outline-none focus:ring-4 focus:ring-accent focus:ring-offset-2 min-w-[200px]"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Join an Activity
            </motion.button>
            <motion.a
              href="#events"
              className="px-8 py-4 bg-white text-neutral-dark text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus:ring-4 focus:ring-primary focus:ring-offset-2 min-w-[200px] text-center"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              View Schedule
            </motion.a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-8 text-neutral-dark"
          >
            <div className="flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="font-medium">November 15, 2025</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-secondary" />
              <span className="font-medium">Community Park</span>
            </div>
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-accent" />
              <span className="font-medium">All Ages Welcome</span>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />
    </section>
  );
}
