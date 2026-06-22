import { useState } from 'react';
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const supportChannels = [
    {
      icon: Mail,
      title: 'Email',
      info: 'support@electronova.com',
      description: 'We reply within one business day.'
    },
    {
      icon: Phone,
      title: 'Phone',
      info: '+1 (800) 555-NOVA',
      description: 'Mon–Fri, 9am–6pm EST.'
    },
    {
      icon: MapPin,
      title: 'Studio',
      info: 'Fifth Avenue, New York',
      description: 'Visits by appointment only.'
    }
  ];

  const inputClasses = 'w-full bg-white border border-gray-200 text-gray-900 rounded-lg py-3 px-4 text-sm leading-normal focus:border-gray-900';

  return (
    <div className="page-shell">
      <div className="page-container space-y-12 animate-fade-in">
        
        <div className="text-center max-w-xl mx-auto space-y-3">
          <span className="eyebrow">Contact</span>
          <h1 className="page-heading">Get in touch</h1>
          <p className="body-muted">
            Questions about an order, warranty, or product specs? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-4">
          
          <div className="space-y-4 text-left lg:col-span-1">
            {supportChannels.map(({ icon: Icon, title, info, description }) => (
              <div key={title} className="p-5 rounded-xl border border-gray-100 bg-gray-50 flex gap-4">
                <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 text-gray-700">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm mb-1">{title}</h4>
                  <p className="text-sm text-gray-900 mb-1">{info}</p>
                  <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 sm:p-8 rounded-xl border border-gray-100 bg-white text-left lg:col-span-2 space-y-6">
            <h3 className="font-medium text-lg text-gray-900 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-gray-500" />
              Send a message
            </h3>

            {success && (
              <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm">
                Your message was received. We will get back to you shortly.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="label-text">Name</label>
                  <input type="text" required name="name" placeholder="Your name" value={formData.name} onChange={handleInputChange} className={inputClasses} />
                </div>
                <div>
                  <label className="label-text">Email</label>
                  <input type="email" required name="email" placeholder="you@email.com" value={formData.email} onChange={handleInputChange} className={inputClasses} />
                </div>
              </div>

              <div>
                <label className="label-text">Subject</label>
                <input type="text" required name="subject" placeholder="How can we help?" value={formData.subject} onChange={handleInputChange} className={inputClasses} />
              </div>

              <div>
                <label className="label-text">Message</label>
                <textarea required rows="5" name="message" placeholder="Write your message..." value={formData.message} onChange={handleInputChange} className={`${inputClasses} resize-none`} />
              </div>

              <button type="submit" disabled={loading} className="btn-primary disabled:opacity-50 disabled:cursor-wait">
                {loading ? 'Sending...' : (
                  <>
                    <Send className="h-4 w-4" />
                    Send message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
