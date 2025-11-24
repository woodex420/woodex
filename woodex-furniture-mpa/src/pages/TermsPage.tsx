import { FileText } from 'lucide-react';

const TermsPage = () => {
  return (
    <div className="bg-white">
      <section className="py-24 bg-background-section">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <FileText className="h-16 w-16 text-primary-500 mb-6" />
          <h1 className="font-heading font-bold text-5xl text-neutral-900 mb-4">
            Terms of Service
          </h1>
          <p className="font-body text-lg text-neutral-700">
            Last updated: November 2025
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-[900px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="space-y-8 font-body text-base text-neutral-700 leading-relaxed">
            <div>
              <h2 className="font-heading font-bold text-3xl text-neutral-900 mb-4">
                1. Agreement to Terms
              </h2>
              <p>
                By accessing or using Woodex Furniture's website and services, you agree to be
                bound by these Terms of Service. If you disagree with any part of these terms,
                please do not use our services.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-bold text-3xl text-neutral-900 mb-4">
                2. Products and Services
              </h2>
              <p className="mb-4">
                Woodex Furniture provides office furniture manufacturing, customization, delivery,
                and installation services. We reserve the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modify or discontinue products without prior notice</li>
                <li>Limit quantities of products available for purchase</li>
                <li>Refuse service to anyone for any reason</li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading font-bold text-3xl text-neutral-900 mb-4">
                3. Orders and Quotations
              </h2>
              <p className="mb-4">
                All quotations are valid for 30 days from the date of issue. Orders are subject to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Product availability and confirmation</li>
                <li>Advance payment as specified in the quotation</li>
                <li>Delivery timeline based on production schedule</li>
                <li>Written acceptance of our quotation terms</li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading font-bold text-3xl text-neutral-900 mb-4">
                4. Pricing and Payment
              </h2>
              <p className="mb-4">Prices are quoted in Pakistani Rupees (PKR) and:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Are subject to change without notice</li>
                <li>May not include delivery charges unless specified</li>
                <li>Require advance payment (typically 50% deposit)</li>
                <li>Final payment due before delivery or upon installation</li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading font-bold text-3xl text-neutral-900 mb-4">
                5. Delivery and Installation
              </h2>
              <p>
                Delivery timelines are estimates and subject to production schedules. We will make
                reasonable efforts to meet agreed timelines but are not liable for delays beyond our
                control. Installation services are provided as specified in your order agreement.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-bold text-3xl text-neutral-900 mb-4">
                6. Returns and Warranty
              </h2>
              <p className="mb-4">
                Custom-made furniture cannot be returned unless defective. Standard products may be
                returned within 7 days if unused and in original packaging. We provide:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>12-month warranty on manufacturing defects</li>
                <li>Free repair or replacement for warranted defects</li>
                <li>Exclusions for damage from misuse or normal wear</li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading font-bold text-3xl text-neutral-900 mb-4">
                7. Intellectual Property
              </h2>
              <p>
                All content on this website, including designs, logos, images, and text, is the
                property of Woodex Furniture and protected by copyright laws. You may not reproduce,
                distribute, or create derivative works without written permission.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-bold text-3xl text-neutral-900 mb-4">
                8. Limitation of Liability
              </h2>
              <p>
                Woodex Furniture shall not be liable for any indirect, incidental, or consequential
                damages arising from the use of our products or services. Our liability is limited
                to the purchase price of the product or service in question.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-bold text-3xl text-neutral-900 mb-4">
                9. Governing Law
              </h2>
              <p>
                These terms are governed by the laws of Pakistan. Any disputes shall be resolved in
                the courts of Karachi, Pakistan.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-bold text-3xl text-neutral-900 mb-4">
                10. Contact Information
              </h2>
              <p className="mb-4">For questions about these Terms of Service:</p>
              <div className="bg-background-section p-6 rounded-lg">
                <p>
                  <strong>Email:</strong> legal@woodexfurniture.pk
                  <br />
                  <strong>Phone:</strong> +92 322 4000 768
                  <br />
                  <strong>Address:</strong> Woodex Furniture, Karachi, Pakistan
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TermsPage;
