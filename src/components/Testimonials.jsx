import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

const Testimonials = () => {
  const reviews = [
    {
      name: 'Marcus Vance',
      role: 'Sound designer',
      quote: 'The Horizon ANC headphones are a masterpiece. Wide soundstage, precise detail, and a clean design that fits my workspace.',
      rating: 5,
      avatar: 'M'
    },
    {
      name: 'Sophia Sterling',
      role: 'Creative director',
      quote: 'ElectroNova redefines tech luxury. The build quality, materials, and noise cancellation feel like a new benchmark.',
      rating: 5,
      avatar: 'S'
    },
    {
      name: 'Ethan Thorne',
      role: 'Tech journalist',
      quote: 'BladeBook 16 is excellent for rendering and writing. The keyboard and display make daily work feel premium.',
      rating: 5,
      avatar: 'E'
    }
  ];

  return (
    <section className="py-16 lg:py-20 bg-white border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
          <span className="eyebrow">Reviews</span>
          <h3 className="section-heading">Trusted by enthusiasts</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((rev, idx) => (
            <motion.div
              key={rev.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className="relative flex flex-col justify-between p-6 rounded-xl border border-gray-100 bg-gray-50"
            >
              <Quote className="absolute top-5 right-5 h-7 w-7 text-gray-200 pointer-events-none" />

              <div className="space-y-4">
                <div className="flex text-gray-900 gap-0.5">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>

                <p className="text-sm text-gray-600 leading-relaxed text-left">
                  "{rev.quote}"
                </p>
              </div>

              <div className="flex items-center gap-3 mt-8 pt-4 border-t border-gray-200">
                <div className="w-9 h-9 rounded-lg bg-gray-900 text-white flex items-center justify-center font-medium text-sm">
                  {rev.avatar}
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900 text-sm">{rev.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5">{rev.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
