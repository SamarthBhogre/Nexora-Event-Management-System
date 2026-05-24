import { FC } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const HeroSection: FC = () => {
  return (
    <section className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-br from-white via-primary-50 to-white dark:from-gray-900 dark:via-primary-900/20 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Discover Amazing
                <span className="block bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
                  Events Near You
                </span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-xl">
                Join thousands of people discovering and registering for the most exciting events. From tech conferences to music festivals, find your next experience.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/events">
                <Button size="lg" fullWidth>
                  Explore Events
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8 border-t border-gray-200 dark:border-gray-700">
              {[
                { number: '10K+', label: 'Events' },
                { number: '50K+', label: 'Users' },
                { number: '100+', label: 'Cities' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Illustration */}
          <div className="relative h-96 md:h-full min-h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl opacity-10 blur-3xl" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full h-full">
                {/* Placeholder for illustration */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-400 via-primary-500 to-primary-600 rounded-3xl opacity-20" />
                <div className="absolute top-10 right-10 w-40 h-40 bg-primary-500 rounded-2xl opacity-20 blur-2xl" />
                <div className="absolute bottom-10 left-10 w-32 h-32 bg-primary-400 rounded-full opacity-30 blur-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary-400 rounded-full opacity-10 blur-2xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-primary-500 rounded-full opacity-10 blur-3xl animate-pulse" />
    </section>
  );
};

export default HeroSection;
