import { Shield } from 'lucide-react';

const PrivacyPage = () => {
  return (
    <div className="bg-white">
      <section className="py-24 bg-background-section">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <Shield className="h-16 w-16 text-primary-500 mb-6" />
          <h1 className="font-heading font-bold text-5xl text-neutral-900 mb-4">
            Privacy Policy
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
                1. Information We Collect
              </h2>
              <p className="mb-4">
                We collect information you provide directly to us, including when you:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Request a quotation or contact us through our forms</li>
                <li>Subscribe to our newsletter or marketing communications</li>
                <li>Visit our showroom or interact with our sales team</li>
                <li>Make a purchase or place an order</li>
              </ul>
              <p className="mt-4">
                Information collected may include: name, email address, phone number, company name,
                shipping address, and payment information.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-bold text-3xl text-neutral-900 mb-4">
                2. How We Use Your Information
              </h2>
              <p className="mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Process and fulfill your orders and quotation requests</li>
                <li>Communicate with you about products, services, and promotions</li>
                <li>Improve our website, products, and customer service</li>
                <li>Comply with legal obligations and resolve disputes</li>
                <li>Personalize your experience and provide relevant content</li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading font-bold text-3xl text-neutral-900 mb-4">
                3. Information Sharing
              </h2>
              <p className="mb-4">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Service providers who assist in operating our business</li>
                <li>Delivery partners for order fulfillment</li>
                <li>Legal authorities when required by law</li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading font-bold text-3xl text-neutral-900 mb-4">
                4. Data Security
              </h2>
              <p>
                We implement appropriate technical and organizational measures to protect your
                personal information against unauthorized access, alteration, disclosure, or
                destruction. However, no internet transmission is completely secure, and we cannot
                guarantee absolute security.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-bold text-3xl text-neutral-900 mb-4">
                5. Your Rights
              </h2>
              <p className="mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access and receive a copy of your personal data</li>
                <li>Correct inaccurate or incomplete information</li>
                <li>Request deletion of your personal data</li>
                <li>Object to or restrict processing of your information</li>
                <li>Opt-out of marketing communications</li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading font-bold text-3xl text-neutral-900 mb-4">
                6. Cookies and Tracking
              </h2>
              <p>
                We use cookies and similar technologies to enhance your browsing experience. See our{' '}
                <a href="/cookies" className="text-primary-500 hover:underline">
                  Cookie Policy
                </a>{' '}
                for more details.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-bold text-3xl text-neutral-900 mb-4">
                7. Contact Us
              </h2>
              <p className="mb-4">
                If you have questions about this Privacy Policy, please contact us:
              </p>
              <div className="bg-background-section p-6 rounded-lg">
                <p>
                  <strong>Email:</strong> privacy@woodexfurniture.pk
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

export default PrivacyPage;
