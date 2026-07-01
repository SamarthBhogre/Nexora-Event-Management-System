import { FC } from 'react';
import MainLayout from '@components/layout/MainLayout';
import { Users, Target, Zap, Heart } from 'lucide-react';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}

const teamMembers: TeamMember[] = [
  {
    name: 'Dhyey',
    role: 'UI/UX Design',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Dhyey',
    bio: 'Creative designer focused on user experience and modern interfaces',
  },
  {
    name: 'Vidhan',
    role: 'Database Design',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vidhan',
    bio: 'Data architecture expert ensuring scalable and efficient systems',
  },
  {
    name: 'Samarth',
    role: 'Full Stack Development',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Samarth',
    bio: 'Full-stack developer building robust and scalable applications',
  },
  {
    name: 'Manthan',
    role: 'Testing & QA',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Manthan',
    bio: 'QA specialist ensuring quality and reliability of the platform',
  },
];

const About: FC = () => {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-primary-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              About Nexora
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Connecting people through amazing events
            </p>
          </div>
        </div>
      </section>

      {/* Company Introduction */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              Who We Are
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
              Nexora is a modern event management platform designed to make discovering, organizing, and attending events seamless and enjoyable. We believe that events bring communities together and create lasting memories.
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Founded by a team of passionate developers and designers, Nexora aims to revolutionize how people connect through events. Whether you're looking for professional networking, entertainment, education, or community engagement, Nexora has something for everyone.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-white dark:bg-dark-card p-8 rounded-xl shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <Target className="text-primary-500" size={28} />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Our Mission
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                To create a platform that empowers event organizers and helps individuals discover extraordinary experiences. We're committed to making event management accessible, efficient, and enjoyable for everyone.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-white dark:bg-dark-card p-8 rounded-xl shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="text-primary-500" size={28} />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Our Vision
                </h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                To become the go-to platform for event discovery and management worldwide. We envision a world where connecting with like-minded people through events is effortless and enriching for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Nexora */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Why Choose Nexora
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full mb-4">
                <Users className="text-primary-500" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Easy Discovery
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Find events tailored to your interests with advanced filtering and search capabilities.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full mb-4">
                <Heart className="text-primary-500" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Community Driven
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Connect with like-minded people and build meaningful relationships through events.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full mb-4">
                <Zap className="text-primary-500" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Powerful Tools
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Organizers get comprehensive tools to create, manage, and promote their events.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Our Team
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {teamMembers.map((member) => (
              <div
                key={member.name}
                className="bg-white dark:bg-dark-card rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 bg-gradient-to-br from-primary-400 to-cyan-400 flex items-center justify-center">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-32 h-32 rounded-full border-4 border-white"
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm font-semibold text-primary-500 mb-2">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-cyan-400">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to find your next amazing event?
          </h2>
          <p className="text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of people already discovering and attending incredible events.
          </p>
          <a
            href="/events"
            className="inline-block px-8 py-3 bg-white text-primary-600 rounded-lg hover:bg-gray-100 transition-colors font-bold"
          >
            Explore Events
          </a>
        </div>
      </section>
    </MainLayout>
  );
};

export default About;
