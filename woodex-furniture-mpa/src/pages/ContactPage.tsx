import { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, Briefcase } from 'lucide-react';
import SEO from '../components/SEO';
import StructuredData, { getBreadcrumbSchema } from '../components/StructuredData';

const ContactPage = () => {
  const breadcrumbData = getBreadcrumbSchema([
    { name: 'Home', url: 'https://9iexwhl63icz.space.minimax.io/' },
    { name: 'Contact', url: 'https://9iexwhl63icz.space.minimax.io/contact' },
  ]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactMethods = [
    {
      icon: Phone,
      title: 'Call Now',
      description: 'Speak directly with our team',
      details: '+92 322 4000 768',
      action: 'tel:+923224000768',
    },
    {
      icon: MessageCircle,
      title: 'Live Chat',
      description: 'Chat with us in real-time',
      details: 'Available Mon-Fri',
      action: '#',
    },
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Send us a detailed message',
      details: 'info@woodexfurniture.pk',
      action: 'mailto:info@woodexfurniture.pk',
    },
    {
      icon: MapPin,
      title: 'Visit Showroom',
      description: 'See our products in person',
      details: 'Karachi, Pakistan',
      action: '#',
    },
  ];

  return (
    <div className="bg-white">
      <SEO
        title="Contact Us - Get Office Furniture Quotes & Consultation"
        description="Contact Woodex Furniture for office furniture inquiries, quotes, and consultations. Call +92 322 4000 768 or email info@woodexfurniture.pk."
        keywords="contact Woodex, furniture quotes Pakistan, consultation Karachi"
        canonicalUrl="https://9iexwhl63icz.space.minimax.io/contact"
      />
      <StructuredData data={breadcrumbData} />
      {/* Hero Section */}
      <section className="py-24 bg-background-section">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="max-w-3xl">
            <h1 className="font-heading font-bold text-5xl lg:text-6xl text-neutral-900 mb-6">
              Get in Touch
            </h1>
            <p className="font-body text-xl text-neutral-700 leading-relaxed">
              Have questions about our products or services? We're here to help. Reach out through
              any of the channels below.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <a
                  key={index}
                  href={method.action}
                  className="bg-white p-8 rounded-lg shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-normal border border-neutral-100 hover:border-primary-500"
                >
                  <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mb-6">
                    <Icon className="h-8 w-8 text-neutral-900" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-neutral-900 mb-2">
                    {method.title}
                  </h3>
                  <p className="font-body text-sm text-neutral-600 mb-3">{method.description}</p>
                  <p className="font-body text-base text-primary-500 font-semibold">
                    {method.details}
                  </p>
                </a>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-24 bg-background-section">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              {submitted ? (
                <div className="bg-primary-500 p-12 rounded-lg">
                  <Send className="h-16 w-16 text-neutral-900 mb-6" />
                  <h2 className="font-heading font-bold text-3xl text-neutral-900 mb-4">
                    Message Sent Successfully!
                  </h2>
                  <p className="font-body text-lg text-neutral-900">
                    Thank you for contacting us. We'll get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-card p-8">
                  <h2 className="font-heading font-bold text-3xl text-neutral-900 mb-8">
                    Send Us a Message
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <label className="block font-body font-semibold text-sm text-neutral-900 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-md font-body focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block font-body font-semibold text-sm text-neutral-900 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-md font-body focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <label className="block font-body font-semibold text-sm text-neutral-900 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-neutral-300 rounded-md font-body focus:outline-none focus:ring-2 focus:ring-primary-500"
                          placeholder="+92 XXX XXXXXXX"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-body font-semibold text-sm text-neutral-900 mb-2">
                        Subject *
                      </label>
                      <select
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-md font-body focus:outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="">Select a subject</option>
                        <option value="general">General Inquiry</option>
                        <option value="quote">Request Quote</option>
                        <option value="custom">Custom Design</option>
                        <option value="support">Customer Support</option>
                        <option value="bulk">Bulk Order</option>
                        <option value="careers">Career Opportunities</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-body font-semibold text-sm text-neutral-900 mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        className="w-full px-4 py-3 border border-neutral-300 rounded-md font-body focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Tell us about your requirements..."
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full flex items-center justify-center px-8 py-4 bg-primary-500 text-neutral-900 font-heading font-bold text-lg rounded-md hover:bg-primary-600 hover:scale-105 transition-all duration-normal"
                    >
                      <Send className="mr-2 h-5 w-5" />
                      Send Message
                    </button>
                  </div>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-lg shadow-card p-8">
                <h3 className="font-heading font-bold text-2xl text-neutral-900 mb-6">
                  Contact Information
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <Phone className="h-6 w-6 text-primary-500 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-body font-semibold text-base text-neutral-900">Phone</p>
                      <a
                        href="tel:+923224000768"
                        className="font-body text-base text-neutral-700 hover:text-primary-500"
                      >
                        +92 322 4000 768
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Mail className="h-6 w-6 text-primary-500 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-body font-semibold text-base text-neutral-900">Email</p>
                      <a
                        href="mailto:info@woodexfurniture.pk"
                        className="font-body text-base text-neutral-700 hover:text-primary-500"
                      >
                        info@woodexfurniture.pk
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <Clock className="h-6 w-6 text-primary-500 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-body font-semibold text-base text-neutral-900">
                        Business Hours
                      </p>
                      <p className="font-body text-base text-neutral-700">
                        Mon-Fri: 10:30 AM - 7:30 PM<br />
                        Sat: 11:00 AM - 5:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4">
                    <MapPin className="h-6 w-6 text-primary-500 flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-body font-semibold text-base text-neutral-900">
                        Location
                      </p>
                      <p className="font-body text-base text-neutral-700">
                        Karachi, Pakistan
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Careers Section */}
              <div id="careers" className="bg-neutral-900 rounded-lg p-8 text-white">
                <Briefcase className="h-12 w-12 text-primary-500 mb-6" />
                <h3 className="font-heading font-bold text-2xl mb-4">Join Our Team</h3>
                <p className="font-body text-base text-neutral-100 mb-6">
                  We're always looking for talented individuals to join the Woodex family.
                </p>
                <a
                  href="mailto:careers@woodexfurniture.pk"
                  className="inline-flex items-center px-6 py-3 bg-primary-500 text-neutral-900 font-heading font-bold rounded-md hover:bg-primary-600 transition-colors"
                >
                  View Opportunities
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-4xl text-neutral-900 mb-4">
              Visit Our Showroom
            </h2>
            <p className="font-body text-lg text-neutral-700">
              Experience our furniture in person at our Karachi showroom
            </p>
          </div>
          <div className="bg-neutral-100 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-primary-500 mx-auto mb-4" />
              <p className="font-body text-lg text-neutral-700">
                Map integration available upon request
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
