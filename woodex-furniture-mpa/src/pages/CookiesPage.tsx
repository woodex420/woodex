import { Cookie } from 'lucide-react';

const CookiesPage = () => {
  return (
    <div className="bg-white">
      <section className="py-24 bg-background-section">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <Cookie className="h-16 w-16 text-primary-500 mb-6" />
          <h1 className="font-heading font-bold text-5xl text-neutral-900 mb-4">
            Cookie Policy
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
                What Are Cookies?
              </h2>
              <p>
                Cookies are small text files stored on your device when you visit our website. They
                help us provide you with a better browsing experience by remembering your
                preferences and understanding how you use our site.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-bold text-3xl text-neutral-900 mb-4">
                How We Use Cookies
              </h2>
              <p className="mb-4">We use cookies for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Essential website functionality and security</li>
                <li>Remembering your preferences and settings</li>
                <li>Analyzing site traffic and user behavior</li>
                <li>Improving our website performance</li>
                <li>Personalizing your experience</li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading font-bold text-3xl text-neutral-900 mb-4">
                Types of Cookies We Use
              </h2>
              
              <div className="space-y-6">
                <div className="bg-background-section p-6 rounded-lg">
                  <h3 className="font-heading font-semibold text-xl text-neutral-900 mb-3">
                    1. Essential Cookies
                  </h3>
                  <p>
                    These cookies are necessary for the website to function properly. They enable
                    basic features like page navigation and access to secure areas. The website
                    cannot function properly without these cookies.
                  </p>
                </div>

                <div className="bg-background-section p-6 rounded-lg">
                  <h3 className="font-heading font-semibold text-xl text-neutral-900 mb-3">
                    2. Analytics Cookies
                  </h3>
                  <p>
                    These cookies help us understand how visitors interact with our website by
                    collecting and reporting information anonymously. This helps us improve our
                    website's performance and user experience.
                  </p>
                </div>

                <div className="bg-background-section p-6 rounded-lg">
                  <h3 className="font-heading font-semibold text-xl text-neutral-900 mb-3">
                    3. Functionality Cookies
                  </h3>
                  <p>
                    These cookies allow the website to remember choices you make (such as your
                    language preference) and provide enhanced, personalized features.
                  </p>
                </div>

                <div className="bg-background-section p-6 rounded-lg">
                  <h3 className="font-heading font-semibold text-xl text-neutral-900 mb-3">
                    4. Marketing Cookies
                  </h3>
                  <p>
                    These cookies track your online activity to help advertisers deliver more
                    relevant advertising or limit how many times you see an advertisement. We may
                    use these with your consent.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-heading font-bold text-3xl text-neutral-900 mb-4">
                Managing Cookies
              </h2>
              <p className="mb-4">
                You can control and manage cookies in various ways:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Browser Settings:</strong> Most browsers allow you to refuse or accept
                  cookies through their settings
                </li>
                <li>
                  <strong>Cookie Preferences:</strong> Use our cookie consent tool to manage your
                  preferences
                </li>
                <li>
                  <strong>Delete Cookies:</strong> You can delete cookies already stored on your
                  device
                </li>
              </ul>
              <p className="mt-4">
                Note: Blocking certain cookies may impact your experience on our website and limit
                certain features.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-bold text-3xl text-neutral-900 mb-4">
                Third-Party Cookies
              </h2>
              <p>
                We may use third-party services that set their own cookies, including analytics
                tools and social media platforms. These third parties have their own privacy
                policies governing the use of their cookies.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-bold text-3xl text-neutral-900 mb-4">
                Updates to This Policy
              </h2>
              <p>
                We may update this Cookie Policy from time to time to reflect changes in technology,
                legislation, or our business practices. Please check this page periodically for
                updates.
              </p>
            </div>

            <div>
              <h2 className="font-heading font-bold text-3xl text-neutral-900 mb-4">
                Contact Us
              </h2>
              <p className="mb-4">
                If you have questions about our use of cookies:
              </p>
              <div className="bg-background-section p-6 rounded-lg">
                <p>
                  <strong>Email:</strong> privacy@woodexfurniture.pk
                  <br />
                  <strong>Phone:</strong> +92 322 4000 768
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CookiesPage;
