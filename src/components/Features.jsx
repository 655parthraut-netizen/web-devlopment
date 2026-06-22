import { Truck, ShieldCheck, Headphones } from 'lucide-react';
import { motion } from 'framer-motion';

const Features = () => {
  const items = [
    {
      icon: Truck,
      title: 'Free delivery',
      description: 'Complimentary shipping on every order, nationwide.',
    },
    {
      icon: Headphones,
      title: 'Expert support',
      description: 'Our team helps you pick the right gear for your setup.',
    },
    {
      icon: ShieldCheck,
      title: 'Secure checkout',
      description: 'Encrypted payments and protected customer data.',
    },
  ];

  return (
    <section className="py-14 lg:py-16 bg-gray-50 border-t border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {items.map(({ icon: Icon, title, description }, idx) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.06 }}
              className="flex flex-col text-left p-6 rounded-xl border border-gray-100 bg-white"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center mb-4 text-gray-700">
                <Icon className="h-5 w-5" />
              </div>
              <h4 className="font-medium text-gray-900 text-base mb-1.5">{title}</h4>
              <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
