import { useState } from 'react';
import { Building2, Users, Award, ExternalLink } from 'lucide-react';

const PortfolioPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Projects' },
    { id: 'corporate', name: 'Corporate Offices' },
    { id: 'government', name: 'Government' },
    { id: 'education', name: 'Education' },
    { id: 'hospitality', name: 'Hospitality' },
  ];

  const projects = [
    {
      id: 1,
      name: 'Tech Hub Corporate Office',
      category: 'corporate',
      client: 'Tech Solutions Ltd.',
      location: 'Karachi',
      year: '2024',
      scope: '200+ workstations, meeting rooms, executive offices',
      image: '/images/office_workstations_8.jpg',
      description:
        'Complete office fitout for a leading tech company with 200+ employees. Modular workstations, collaborative spaces, and executive suites.',
    },
    {
      id: 2,
      name: 'Marketing Agency Workspace',
      category: 'corporate',
      client: 'Creative Marketing Pro',
      location: 'Lahore',
      year: '2024',
      scope: 'Custom design workstations, meeting areas',
      image: '/images/executive_desk_7.jpg',
      description:
        'Modern, creative workspace with flexible seating and collaborative zones for a dynamic marketing team.',
    },
    {
      id: 3,
      name: 'Government Ministry Office',
      category: 'government',
      client: 'Ministry of Commerce',
      location: 'Islamabad',
      year: '2023',
      scope: 'Executive furniture, conference rooms',
      image: '/images/meeting_table_7.jpg',
      description:
        'Premium executive furniture and large conference tables for government ministry offices.',
    },
    {
      id: 4,
      name: 'University Faculty Offices',
      category: 'education',
      client: 'National University',
      location: 'Islamabad',
      year: '2023',
      scope: 'Faculty offices, administrative areas',
      image: '/images/executive_desk_2.jpg',
      description:
        'Functional and elegant furniture solutions for university faculty offices and administrative departments.',
    },
    {
      id: 5,
      name: 'Hotel Business Center',
      category: 'hospitality',
      client: 'Pearl Continental Hotel',
      location: 'Karachi',
      year: '2024',
      scope: 'Business center, conference facilities',
      image: '/images/reception_furniture_6.jpg',
      description:
        'Sophisticated furniture for hotel business center and conference facilities serving international clients.',
    },
    {
      id: 6,
      name: 'Financial Institution HQ',
      category: 'corporate',
      client: 'Pakistan Finance Corp',
      location: 'Karachi',
      year: '2023',
      scope: 'Complete HQ fitout - 500+ pieces',
      image: '/images/office_workstations_4.jpg',
      description:
        'Large-scale project furnishing the headquarters of a major financial institution with premium furniture.',
    },
  ];

  const filteredProjects = projects.filter(
    (project) => selectedCategory === 'all' || project.category === selectedCategory
  );

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="py-24 bg-background-section">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="max-w-3xl">
            <h1 className="font-heading font-bold text-5xl lg:text-6xl text-neutral-900 mb-6">
              Our Portfolio
            </h1>
            <p className="font-body text-xl text-neutral-700 leading-relaxed">
              Showcasing our finest projects across corporate, government, education, and
              hospitality sectors.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-white border-b border-neutral-100">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-heading font-bold text-5xl text-primary-500 mb-2">5000+</div>
              <div className="font-body text-lg text-neutral-700">Projects Completed</div>
            </div>
            <div>
              <div className="font-heading font-bold text-5xl text-primary-500 mb-2">15+</div>
              <div className="font-body text-lg text-neutral-700">Years Experience</div>
            </div>
            <div>
              <div className="font-heading font-bold text-5xl text-primary-500 mb-2">50+</div>
              <div className="font-body text-lg text-neutral-700">Cities Served</div>
            </div>
            <div>
              <div className="font-heading font-bold text-5xl text-primary-500 mb-2">98%</div>
              <div className="font-body text-lg text-neutral-700">Client Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-background-section sticky top-20 z-40">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-md font-heading font-semibold transition-all duration-normal ${
                  selectedCategory === category.id
                    ? 'bg-primary-500 text-neutral-900'
                    : 'bg-white text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-lg shadow-card hover:shadow-card-hover transition-all duration-normal overflow-hidden"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-slow"
                  />
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-4">
                    <span className="px-3 py-1 bg-primary-500 text-neutral-900 font-body font-semibold text-sm rounded-full">
                      {project.year}
                    </span>
                    <span className="text-neutral-600 font-body text-sm">
                      {project.location}
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-3xl text-neutral-900 mb-3">
                    {project.name}
                  </h3>
                  <p className="font-body text-base text-neutral-700 mb-4">
                    {project.description}
                  </p>
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-neutral-700">
                      <Building2 className="h-5 w-5 text-primary-500 mr-2" />
                      <span className="font-body text-sm font-semibold">Client:</span>
                      <span className="font-body text-sm ml-2">{project.client}</span>
                    </div>
                    <div className="flex items-center text-neutral-700">
                      <Award className="h-5 w-5 text-primary-500 mr-2" />
                      <span className="font-body text-sm font-semibold">Scope:</span>
                      <span className="font-body text-sm ml-2">{project.scope}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-24 bg-background-section">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-16">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-4xl text-neutral-900 mb-4">
              Featured Case Studies
            </h2>
            <p className="font-body text-lg text-neutral-700 max-w-2xl mx-auto">
              In-depth look at our most transformative projects
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-card">
              <Building2 className="h-12 w-12 text-primary-500 mb-6" />
              <h3 className="font-heading font-semibold text-2xl text-neutral-900 mb-4">
                Corporate Excellence
              </h3>
              <p className="font-body text-base text-neutral-700 mb-6">
                How we transformed a 50,000 sq ft corporate office with 200+ custom workstations
                and collaborative spaces.
              </p>
              <button className="inline-flex items-center text-primary-500 font-body font-semibold hover:underline">
                Read Case Study
                <ExternalLink className="ml-2 h-4 w-4" />
              </button>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-card">
              <Users className="h-12 w-12 text-primary-500 mb-6" />
              <h3 className="font-heading font-semibold text-2xl text-neutral-900 mb-4">
                Government Project
              </h3>
              <p className="font-body text-base text-neutral-700 mb-6">
                Delivering premium executive furniture for a major government ministry with strict
                quality requirements.
              </p>
              <button className="inline-flex items-center text-primary-500 font-body font-semibold hover:underline">
                Read Case Study
                <ExternalLink className="ml-2 h-4 w-4" />
              </button>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-card">
              <Award className="h-12 w-12 text-primary-500 mb-6" />
              <h3 className="font-heading font-semibold text-2xl text-neutral-900 mb-4">
                Award Winner
              </h3>
              <p className="font-body text-base text-neutral-700 mb-6">
                Our award-winning hotel business center design that combines luxury with
                functionality for international guests.
              </p>
              <button className="inline-flex items-center text-primary-500 font-body font-semibold hover:underline">
                Read Case Study
                <ExternalLink className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-24 bg-neutral-900 text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-8 lg:px-16 text-center">
          <blockquote className="font-body text-2xl italic mb-8">
            "Woodex Furniture delivered exceptional quality and service for our 200-employee
            office. The team understood our needs and created a workspace that truly enhances
            productivity."
          </blockquote>
          <div>
            <p className="font-heading font-semibold text-xl mb-2">Ahmed Hassan</p>
            <p className="font-body text-neutral-100">CEO, Tech Solutions Ltd.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PortfolioPage;
