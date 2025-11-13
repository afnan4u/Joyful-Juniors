import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Heart, Users, Clock, HandHeart, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Volunteer as VolunteerType } from '../types';

export function Volunteer() {
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<VolunteerType>();

  const onSubmit = async (data: VolunteerType) => {
    const { error } = await supabase.from('volunteers').insert([data]);

    if (!error) {
      setSuccess(true);
      reset();
      setTimeout(() => setSuccess(false), 5000);
    }
  };

  const benefits = [
    { icon: Heart, title: 'Make a Difference', description: 'Help create magical memories for children' },
    { icon: Users, title: 'Join Our Community', description: 'Meet like-minded people who care' },
    { icon: Clock, title: 'Flexible Hours', description: 'Choose shifts that work for you' },
    { icon: HandHeart, title: 'Give Back', description: 'Support families in your community' },
  ];

  return (
    <section id="volunteer" className="py-16 md:py-24 bg-gradient-to-br from-accent-light via-white to-primary-light">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-neutral-dark mb-4">
            Volunteer With Us
          </h2>
          <p className="text-lg md:text-xl text-neutral-dark/80 max-w-2xl mx-auto">
            Be part of something special. Help us create joy and lasting memories!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-lg text-center"
            >
              <div className="bg-gradient-to-br from-accent to-primary rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <benefit.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-display font-bold text-neutral-dark mb-2">{benefit.title}</h3>
              <p className="text-sm text-neutral-dark/70">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto bg-white rounded-3xl p-6 md:p-8 shadow-xl"
        >
          {success ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              className="text-center py-8"
            >
              <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
              <h3 className="text-2xl font-display font-bold text-neutral-dark mb-2">
                Thank You for Volunteering!
              </h3>
              <p className="text-neutral-dark/70">
                We'll be in touch soon with more details about volunteer opportunities.
              </p>
            </motion.div>
          ) : (
            <>
              <h3 className="text-2xl font-display font-bold text-neutral-dark mb-6 text-center">
                Sign Up to Volunteer
              </h3>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-neutral-dark mb-2">
                    Full Name *
                  </label>
                  <input
                    {...register('name', { required: 'Name is required' })}
                    className="w-full px-4 py-3 border border-neutral rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <p className="text-accent text-sm mt-1">{errors.name.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-dark mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    {...register('email', {
                      required: 'Email is required',
                      pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
                    })}
                    className="w-full px-4 py-3 border border-neutral rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="text-accent text-sm mt-1">{errors.email.message}</p>
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

                <div>
                  <label className="block text-sm font-semibold text-neutral-dark mb-2">
                    Availability *
                  </label>
                  <select
                    {...register('availability', { required: 'Please select your availability' })}
                    className="w-full px-4 py-3 border border-neutral rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select availability</option>
                    <option value="Morning (9am - 12pm)">Morning (9am - 12pm)</option>
                    <option value="Afternoon (12pm - 3pm)">Afternoon (12pm - 3pm)</option>
                    <option value="Evening (3pm - 6pm)">Evening (3pm - 6pm)</option>
                    <option value="All Day">All Day</option>
                  </select>
                  {errors.availability && (
                    <p className="text-accent text-sm mt-1">{errors.availability.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-dark mb-2">
                    Skills & Interests (Optional)
                  </label>
                  <textarea
                    {...register('skills')}
                    className="w-full px-4 py-3 border border-neutral rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows={4}
                    placeholder="Tell us about your skills, experience, or what areas you'd like to help with..."
                  />
                </div>

                <motion.button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-accent to-accent-dark text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Submit Volunteer Application
                </motion.button>
              </form>
            </>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-neutral-dark/70 mb-4">
            Want to support in other ways?
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              className="px-8 py-3 bg-primary text-neutral-dark font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Become a Sponsor
            </motion.button>
            <motion.button
              className="px-8 py-3 bg-secondary text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow focus:outline-none focus:ring-2 focus:ring-secondary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Make a Donation
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
