import { Target, Users, Award, Lightbulb, Heart, Shield, Leaf } from 'lucide-react';
import SEO from '../components/SEO';
import StructuredData, { getBreadcrumbSchema } from '../components/StructuredData';

const AboutPage = () => {
  const breadcrumbData = getBreadcrumbSchema([
    { name: 'Home', url: 'https://9iexwhl63icz.space.minimax.io/' },
    { name: 'About Us', url: 'https://9iexwhl63icz.space.minimax.io/about' },
  ]);

  const values = [
    {
      icon: Award,
      title: 'Quality Excellence',
      description:
        'Premium materials and expert craftsmanship in every piece. We never compromise on quality standards.',
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description:
        'Cutting-edge designs that blend ergonomics, aesthetics, and functionality for modern workspaces.',
    },
    {
      icon: Leaf,
      title: 'Sustainability',
      description:
        'Eco-friendly practices and sustainable materials to reduce environmental impact.',
    },
    {
      icon: Heart,
      title: 'Customer-Centricity',
      description:
        'Your satisfaction drives everything we do. Personalized service and lasting relationships.',
    },
  ];

  const milestones = [
    { year: '2010', title: 'Founded', description: 'Started with a vision to transform Pakistani office spaces' },
    { year: '2015', title: '1000+ Projects', description: 'Completed major installations across Pakistan' },
    { year: '2020', title: 'Export Expansion', description: 'Began exporting to international markets' },
    { year: '2025', title: 'Industry Leader', description: 'Recognized as Pakistan\'s premium furniture brand' },
  ];

  const team = [
    { name: 'Muhammad Tariq', role: 'Founder & CEO', image: '/images/about_us_image_1.jpeg' },
    { name: 'Ayesha Malik', role: 'Head of Design', image: '/images/about_us_image_3.jpg' },
    { name: 'Kamran Siddiqui', role: 'Operations Director', image: '/images/about_us_image_6.jpeg' },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative py-24 bg-background-section">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="max-w-3xl">
            <h1 className="font-heading font-bold text-5xl lg:text-6xl text-neutral-900 mb-6">
              Crafting Excellence in Office Furniture Since 2010
            </h1>
            <p className="font-body text-xl text-neutral-700 leading-relaxed">
              From a small workshop in Karachi to Pakistan's leading office furniture manufacturer,
              our journey is built on quality, innovation, and customer trust.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-heading font-bold text-4xl text-neutral-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 font-body text-lg text-neutral-700 leading-relaxed">
                <p>
                  Woodex Furniture was founded in 2010 with a simple yet ambitious goal: to provide
                  Pakistani businesses with world-class office furniture that doesn't compromise on
                  quality or affordability.
                </p>
                <p>
                  What started as a small workshop has grown into a comprehensive manufacturing
                  facility, serving hundreds of clients across Pakistan. We've equipped offices for
                  startups, multinational corporations, government institutions, and everything in
                  between.
                </p>
                <p>
                  Today, we're proud to be recognized as one of Pakistan's premier office furniture
                  brands, known for our commitment to quality, innovative designs, and exceptional
                  customer service.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="/images/about_us_image_1.jpeg"
                alt="Our facility"
                className="rounded-lg shadow-card w-full h-64 object-cover"
              />
              <img
                src="/images/about_us_image_3.jpg"
                alt="Our craftsmanship"
                className="rounded-lg shadow-card w-full h-64 object-cover mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-background-section">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-white p-12 rounded-lg shadow-card">
              <Target className="h-12 w-12 text-primary-500 mb-6" />
              <h2 className="font-heading font-bold text-3xl text-neutral-900 mb-4">
                Our Mission
              </h2>
              <p className="font-body text-lg text-neutral-700 leading-relaxed">
                To redefine office spaces across Pakistan by delivering premium, ergonomic furniture
                that enhances productivity, comfort, and workplace aesthetics while maintaining
                exceptional value for our clients.
              </p>
            </div>
            <div className="bg-white p-12 rounded-lg shadow-card">
              <Users className="h-12 w-12 text-primary-500 mb-6" />
              <h2 className="font-heading font-bold text-3xl text-neutral-900 mb-4">
                Our Vision
              </h2>
              <p className="font-body text-lg text-neutral-700 leading-relaxed">
                To be South Asia's most trusted office furniture brand, recognized for innovation,
                sustainability, and transforming workspaces into environments where people thrive
                and businesses succeed.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-4xl text-neutral-900 mb-4">
              Our Core Values
            </h2>
            <p className="font-body text-lg text-neutral-700 max-w-2xl mx-auto">
              The principles that guide every decision we make
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-lg shadow-card hover:shadow-card-hover transition-all duration-normal text-center"
                >
                  <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Icon className="h-8 w-8 text-neutral-900" />
                  </div>
                  <h3 className="font-heading font-semibold text-xl text-neutral-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="font-body text-base text-neutral-700">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-24 bg-background-section">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-4xl text-neutral-900 mb-4">
              Our Journey
            </h2>
            <p className="font-body text-lg text-neutral-700">
              Key milestones in our growth story
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-heading font-bold text-2xl text-neutral-900">
                    {milestone.year}
                  </span>
                </div>
                <h3 className="font-heading font-semibold text-xl text-neutral-900 mb-2">
                  {milestone.title}
                </h3>
                <p className="font-body text-base text-neutral-700">{milestone.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-4xl text-neutral-900 mb-4">
              Our Leadership Team
            </h2>
            <p className="font-body text-lg text-neutral-700">
              Experienced professionals driving our vision forward
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="mb-6 overflow-hidden rounded-lg">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-80 object-cover hover:scale-110 transition-transform duration-slow"
                  />
                </div>
                <h3 className="font-heading font-semibold text-2xl text-neutral-900 mb-2">
                  {member.name}
                </h3>
                <p className="font-body text-lg text-neutral-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-24 bg-neutral-900 text-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="text-center">
            <Shield className="h-16 w-16 text-primary-500 mx-auto mb-6" />
            <h2 className="font-heading font-bold text-4xl mb-6">
              Certified Quality Standards
            </h2>
            <p className="font-body text-xl text-neutral-100 max-w-3xl mx-auto mb-8">
              Our manufacturing processes meet international quality standards. We're committed to
              delivering furniture that exceeds expectations and stands the test of time.
            </p>
            <div className="flex flex-wrap justify-center gap-8 mt-12">
              <div className="text-center">
                <div className="font-heading font-bold text-5xl text-primary-500 mb-2">15+</div>
                <div className="font-body text-lg text-neutral-100">Years Experience</div>
              </div>
              <div className="text-center">
                <div className="font-heading font-bold text-5xl text-primary-500 mb-2">5000+</div>
                <div className="font-body text-lg text-neutral-100">Projects Completed</div>
              </div>
              <div className="text-center">
                <div className="font-heading font-bold text-5xl text-primary-500 mb-2">98%</div>
                <div className="font-body text-lg text-neutral-100">Client Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
