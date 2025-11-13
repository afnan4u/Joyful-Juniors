import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Palette, Brain, Dumbbell, Gamepad2, Clock, Users, User, CheckCircle, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Activity, ActivitySignup } from '../types';

const categoryIcons: Record<string, any> = {
  arts: Palette,
  learning: Brain,
  sports: Dumbbell,
  games: Gamepad2,
};

const categoryColors: Record<string, string> = {
  arts: 'from-accent to-accent-light',
  learning: 'from-secondary to-secondary-light',
  sports: 'from-primary-dark to-primary',
  games: 'from-accent-light to-secondary-light',
};

export function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [loading, setLoading] = useState(true);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ActivitySignup>();

  useEffect(() => {
    async function fetchActivities() {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .order('start_time', { ascending: true });

      if (!error && data) {
        setActivities(data);
        setFilteredActivities(data);
      }
      setLoading(false);
    }

    fetchActivities();
  }, []);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredActivities(activities);
    } else {
      setFilteredActivities(activities.filter((a) => a.category === selectedCategory));
    }
  }, [selectedCategory, activities]);

  const onSubmit = async (data: ActivitySignup) => {
    if (!selectedActivity) return;

    const signupData = {
      ...data,
      activity_id: selectedActivity.id,
    };

    const { error } = await supabase.from('activity_signups').insert([signupData]);

    if (!error) {
      await supabase
        .from('activities')
        .update({ registered_count: selectedActivity.registered_count + 1 })
        .eq('id', selectedActivity.id);

      setSignupSuccess(true);
      reset();

      setTimeout(() => {
        setShowModal(false);
        setSignupSuccess(false);
        setSelectedActivity(null);
        window.location.reload();
      }, 2000);
    }
  };

  const categories = [
    { id: 'all', label: 'All Activities' },
    { id: 'arts', label: 'Arts & Crafts' },
    { id: 'learning', label: 'Learning' },
    { id: 'sports', label: 'Sports' },
    { id: 'games', label: 'Games' },
  ];

  if (loading) {
    return (
      <section id="activities" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-neutral-dark">Loading exciting activities...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="activities" className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-neutral-dark mb-4">
            Activities & Workshops
          </h2>
          <p className="text-lg md:text-xl text-neutral-dark/80 max-w-2xl mx-auto">
            Join fun-filled workshops led by expert instructors. Limited spots available!
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                selectedCategory === category.id
                  ? 'bg-primary text-neutral-dark shadow-lg'
                  : 'bg-neutral-light text-neutral-dark hover:bg-neutral'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category.label}
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity, index) => {
            const Icon = categoryIcons[activity.category] || Gamepad2;
            const gradient = categoryColors[activity.category] || categoryColors.games;
            const isFull = activity.registered_count >= activity.capacity;
            const spotsLeft = activity.capacity - activity.registered_count;

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-neutral-light rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
              >
                <div className={`bg-gradient-to-br ${gradient} p-6 text-white`}>
                  <Icon className="w-10 h-10 mb-3" />
                  <h3 className="text-xl font-display font-bold mb-2">{activity.title}</h3>
                  <p className="text-sm opacity-90">{activity.age_group}</p>
                </div>
                <div className="p-6">
                  <p className="text-neutral-dark/80 mb-4 line-clamp-2">{activity.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-neutral-dark/70">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>
                        {new Date(activity.start_time).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {' - '}
                        {new Date(activity.end_time).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-neutral-dark/70">
                      <User className="w-4 h-4 text-secondary" />
                      <span>Instructor: {activity.instructor}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <Users className="w-4 h-4 text-accent" />
                      <span className={isFull ? 'text-accent font-semibold' : 'text-neutral-dark/70'}>
                        {isFull ? 'Full!' : `${spotsLeft} spots left`}
                      </span>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => {
                      if (!isFull) {
                        setSelectedActivity(activity);
                        setShowModal(true);
                      }
                    }}
                    disabled={isFull}
                    className={`w-full py-3 rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                      isFull
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-primary to-secondary text-neutral-dark hover:shadow-lg'
                    }`}
                    whileHover={!isFull ? { scale: 1.02, y: -2 } : {}}
                    whileTap={!isFull ? { scale: 0.98 } : {}}
                  >
                    {isFull ? 'Fully Booked' : 'Sign Up Now'}
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {showModal && selectedActivity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => !signupSuccess && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {signupSuccess ? (
                <div className="text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring' }}
                  >
                    <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                  </motion.div>
                  <h3 className="text-2xl font-display font-bold text-neutral-dark mb-2">
                    Registration Successful!
                  </h3>
                  <p className="text-neutral-dark/70">
                    We're so excited to see you at {selectedActivity.title}!
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-2xl font-display font-bold text-neutral-dark">
                      Sign Up for {selectedActivity.title}
                    </h3>
                    <button
                      onClick={() => setShowModal(false)}
                      className="p-2 hover:bg-neutral-light rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-dark mb-2">
                        Parent/Guardian Name *
                      </label>
                      <input
                        {...register('parent_name', { required: 'Parent name is required' })}
                        className="w-full px-4 py-3 border border-neutral rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Your name"
                      />
                      {errors.parent_name && (
                        <p className="text-accent text-sm mt-1">{errors.parent_name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-dark mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        {...register('parent_email', {
                          required: 'Email is required',
                          pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
                        })}
                        className="w-full px-4 py-3 border border-neutral rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="your@email.com"
                      />
                      {errors.parent_email && (
                        <p className="text-accent text-sm mt-1">{errors.parent_email.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-dark mb-2">
                        Child's Name *
                      </label>
                      <input
                        {...register('child_name', { required: "Child's name is required" })}
                        className="w-full px-4 py-3 border border-neutral rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Child's name"
                      />
                      {errors.child_name && (
                        <p className="text-accent text-sm mt-1">{errors.child_name.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-dark mb-2">
                        Child's Age *
                      </label>
                      <input
                        type="number"
                        {...register('child_age', {
                          required: 'Age is required',
                          min: { value: 1, message: 'Age must be at least 1' },
                          max: { value: 18, message: 'Age must be under 18' },
                        })}
                        className="w-full px-4 py-3 border border-neutral rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Age"
                      />
                      {errors.child_age && (
                        <p className="text-accent text-sm mt-1">{errors.child_age.message}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-neutral-dark mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        {...register('phone', { required: 'Phone number is required' })}
                        className="w-full px-4 py-3 border border-neutral rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="+1 (555) 123-4567"
                      />
                      {errors.phone && (
                        <p className="text-accent text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>

                    <motion.button
                      type="submit"
                      className="w-full py-4 bg-gradient-to-r from-accent to-accent-dark text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Complete Registration
                    </motion.button>
                  </form>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
