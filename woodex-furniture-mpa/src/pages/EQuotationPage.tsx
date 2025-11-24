import { useState } from 'react';
import { FileText, Send, CheckCircle, Upload } from 'lucide-react';

const EQuotationPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    productCategory: '',
    quantity: '',
    timeline: '',
    budget: '',
    customization: 'no',
    description: '',
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

  const productCategories = [
    'Ergonomic Chairs',
    'Executive Desks',
    'Office Workstations',
    'Meeting Tables',
    'Reception Furniture',
    'Office Sofas',
    'Storage Solutions',
    'Complete Office Fitout',
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-24 bg-background-section">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="h-8 w-8 text-primary-500" />
              <span className="px-4 py-2 bg-primary-500 text-neutral-900 font-heading font-bold text-sm rounded-full">
                NEW SERVICE
              </span>
            </div>
            <h1 className="font-heading font-bold text-5xl lg:text-6xl text-neutral-900 mb-6">
              Get Instant Quotation
            </h1>
            <p className="font-body text-xl text-neutral-700 leading-relaxed">
              Fast, transparent pricing for all your office furniture needs. Fill out the form
              below and receive a detailed quote within 24 hours.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-white border-b border-neutral-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-neutral-900" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-neutral-900 mb-2">
                24-Hour Response
              </h3>
              <p className="font-body text-sm text-neutral-700">
                Receive detailed quotes within one business day
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-neutral-900" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-neutral-900 mb-2">
                Transparent Pricing
              </h3>
              <p className="font-body text-sm text-neutral-700">
                Clear breakdown of costs with no hidden fees
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-neutral-900" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-neutral-900 mb-2">
                No Obligation
              </h3>
              <p className="font-body text-sm text-neutral-700">
                Free quotes with no pressure to commit
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-neutral-900" />
              </div>
              <h3 className="font-heading font-semibold text-lg text-neutral-900 mb-2">
                Expert Advice
              </h3>
              <p className="font-body text-sm text-neutral-700">
                Recommendations based on your specific needs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Quotation Form */}
      <section className="py-24">
        <div className="max-w-[900px] mx-auto px-4 sm:px-8 lg:px-16">
          {submitted ? (
            <div className="bg-primary-500 p-12 rounded-lg text-center">
              <CheckCircle className="h-16 w-16 text-neutral-900 mx-auto mb-6" />
              <h2 className="font-heading font-bold text-3xl text-neutral-900 mb-4">
                Quote Request Submitted!
              </h2>
              <p className="font-body text-lg text-neutral-900">
                Thank you for your interest. Our team will review your requirements and send you a
                detailed quotation within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-card p-8 lg:p-12">
              <h2 className="font-heading font-bold text-3xl text-neutral-900 mb-8">
                Request Your Quote
              </h2>

              {/* Contact Information */}
              <div className="mb-8">
                <h3 className="font-heading font-semibold text-xl text-neutral-900 mb-6">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-body font-semibold text-sm text-neutral-900 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-md font-body focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block font-body font-semibold text-sm text-neutral-900 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-md font-body focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="Your company"
                    />
                  </div>
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
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block font-body font-semibold text-sm text-neutral-900 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-md font-body focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="+92 XXX XXXXXXX"
                    />
                  </div>
                </div>
              </div>

              {/* Project Details */}
              <div className="mb-8">
                <h3 className="font-heading font-semibold text-xl text-neutral-900 mb-6">
                  Project Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-body font-semibold text-sm text-neutral-900 mb-2">
                      Product Category *
                    </label>
                    <select
                      name="productCategory"
                      required
                      value={formData.productCategory}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-md font-body focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select category</option>
                      {productCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-body font-semibold text-sm text-neutral-900 mb-2">
                      Quantity / Scope *
                    </label>
                    <input
                      type="text"
                      name="quantity"
                      required
                      value={formData.quantity}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-md font-body focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g., 50 chairs, complete office"
                    />
                  </div>
                  <div>
                    <label className="block font-body font-semibold text-sm text-neutral-900 mb-2">
                      Timeline *
                    </label>
                    <select
                      name="timeline"
                      required
                      value={formData.timeline}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-md font-body focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select timeline</option>
                      <option value="urgent">Urgent (1-2 weeks)</option>
                      <option value="standard">Standard (3-4 weeks)</option>
                      <option value="flexible">Flexible (1-2 months)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-body font-semibold text-sm text-neutral-900 mb-2">
                      Budget Range
                    </label>
                    <select
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-neutral-300 rounded-md font-body focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                      <option value="">Select budget range</option>
                      <option value="50k-100k">PKR 50,000 - 100,000</option>
                      <option value="100k-500k">PKR 100,000 - 500,000</option>
                      <option value="500k-1m">PKR 500,000 - 1,000,000</option>
                      <option value="1m+">PKR 1,000,000+</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block font-body font-semibold text-sm text-neutral-900 mb-2">
                      Customization Required?
                    </label>
                    <div className="flex gap-6">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="customization"
                          value="no"
                          checked={formData.customization === 'no'}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <span className="font-body text-base text-neutral-700">
                          No, standard products
                        </span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="customization"
                          value="yes"
                          checked={formData.customization === 'yes'}
                          onChange={handleChange}
                          className="mr-2"
                        />
                        <span className="font-body text-base text-neutral-700">
                          Yes, custom design
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="mb-8">
                <label className="block font-body font-semibold text-sm text-neutral-900 mb-2">
                  Additional Details
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-md font-body focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Please provide any additional details about your requirements, space constraints, special features needed, etc."
                />
              </div>

              {/* File Upload */}
              <div className="mb-8">
                <label className="block font-body font-semibold text-sm text-neutral-900 mb-2">
                  Upload Files (Optional)
                </label>
                <div className="border-2 border-dashed border-neutral-300 rounded-md p-8 text-center hover:border-primary-500 transition-colors">
                  <Upload className="h-12 w-12 text-neutral-400 mx-auto mb-4" />
                  <p className="font-body text-sm text-neutral-700 mb-2">
                    Upload floor plans, specifications, or reference images
                  </p>
                  <p className="font-body text-xs text-neutral-600">
                    Supported formats: PDF, JPG, PNG (Max 10MB)
                  </p>
                  <button
                    type="button"
                    className="mt-4 px-6 py-2 bg-neutral-100 text-neutral-700 font-body font-semibold rounded-md hover:bg-neutral-200 transition-colors"
                  >
                    Choose Files
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="w-full flex items-center justify-center px-8 py-4 bg-primary-500 text-neutral-900 font-heading font-bold text-lg rounded-md hover:bg-primary-600 hover:scale-105 transition-all duration-normal"
              >
                <Send className="mr-2 h-5 w-5" />
                Submit Quote Request
              </button>

              <p className="font-body text-sm text-neutral-600 text-center mt-6">
                By submitting this form, you agree to our{' '}
                <a href="/privacy" className="text-primary-500 hover:underline">
                  Privacy Policy
                </a>
              </p>
            </form>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-background-section">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-4xl text-neutral-900 mb-4">
              Quotation FAQ
            </h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-heading font-semibold text-lg text-neutral-900 mb-2">
                How long does it take to receive a quote?
              </h3>
              <p className="font-body text-base text-neutral-700">
                We respond to all quote requests within 24 business hours with a detailed
                quotation including pricing, specifications, and delivery timeline.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-heading font-semibold text-lg text-neutral-900 mb-2">
                Is the quote final or can it change?
              </h3>
              <p className="font-body text-base text-neutral-700">
                Our quotes are valid for 30 days and include all specified items. Changes to
                specifications may affect pricing, which we'll communicate clearly.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-heading font-semibold text-lg text-neutral-900 mb-2">
                Do you offer bulk discounts?
              </h3>
              <p className="font-body text-base text-neutral-700">
                Yes, we provide competitive pricing for bulk orders. Larger projects often qualify
                for volume discounts, which will be reflected in your quote.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EQuotationPage;
