import { Sparkles, Eye, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="page-shell">
      <div className="page-container space-y-20 animate-fade-in">
        
        <section className="text-center max-w-2xl mx-auto space-y-5">
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="eyebrow"
          >
            Our story
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl sm:text-5xl font-semibold tracking-tight text-gray-900 leading-tight"
          >
            Redefining tech aesthetics
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="body-muted text-base sm:text-lg"
          >
            Founded in 2024, ElectroNova brings together premium mice, keyboards, monitors, and accessories for people who care about performance and clean design.
          </motion.p>
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="space-y-5 text-left">
            <span className="eyebrow">Craft & performance</span>
            <h2 className="section-heading">
              Built without compromise
            </h2>
            <p className="body-muted">
              Our products use quality sensors, switches, and panels tested for daily use. Every item is chosen to feel premium without unnecessary complexity.
            </p>
            <p className="body-muted">
              Every detail is meant to disappear into daily use while still feeling distinctly premium.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                icon: Sparkles,
                title: 'Selected materials',
                text: 'Titanium alloys, aluminum, carbon fiber, and quality leather where it matters.'
              },
              {
                icon: Eye,
                title: 'Minimal design',
                text: 'Clean geometry, subtle finishes, and interfaces that stay out of the way.'
              },
              {
                icon: ShieldCheck,
                title: 'Long-term support',
                text: 'Registered products connect to warranty support and service when you need it.'
              }
            ].map(({ icon: Icon, title, text }) => (
              <div key={title} className="p-5 rounded-xl border border-gray-100 bg-gray-50 text-left flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 text-gray-700 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-100 bg-gray-50 p-10 sm:p-14 text-center space-y-4">
          <h2 className="eyebrow mb-0">Our motto</h2>
          <p className="text-xl sm:text-2xl font-medium text-gray-900 leading-relaxed max-w-2xl mx-auto">
            Crafting the future of sensory luxury with technology you can trust.
          </p>
        </section>
      </div>
    </div>
  );
};

export default About;
