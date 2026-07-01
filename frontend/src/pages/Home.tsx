import { FC, useState, useEffect } from 'react';
import MainLayout from '@components/layout/MainLayout';
import HeroSection from '@components/sections/HeroSection';
import FeaturesSection from '@components/sections/FeaturesSection';
import CTASection from '@components/sections/CTASection';
import EventGrid from '@components/events/EventGrid';
import CategoryCard from '@components/categories/CategoryCard';
import { eventService, Event, Category } from '@services/eventService';
import Loader from '@components/common/Loader';

const Home: FC = () => {
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [featured, cats] = await Promise.all([
          eventService.getFeaturedEvents(3),
          eventService.getCategories(),
        ]);
        setFeaturedEvents(featured);
        setCategories(cats.slice(0, 4)); // Show only 4 categories
      } catch (error) {
        console.error('Error loading home data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <MainLayout>
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Events Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Featured Events
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Check out some of our most popular upcoming events
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader size="md" message="Loading events..." />
            </div>
          ) : (
            <EventGrid events={featuredEvents} />
          )}

          <div className="text-center mt-8">
            <a
              href="/events"
              className="inline-block px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
            >
              View All Events
            </a>
          </div>
        </div>
      </section>

      {/* Event Categories Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
              Event Categories
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Explore events by your interests
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onClick={() => (window.location.href = `/events?category=${category.id}`)}
              />
            ))}
          </div>

          <div className="text-center">
            <a
              href="/categories"
              className="inline-block px-8 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
            >
              View All Categories
            </a>
          </div>
        </div>
      </section>

      {/* Why Choose Nexora Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">
            Why Choose Nexora?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-dark-card p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Find Your Perfect Event
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                With thousands of events across multiple categories, you're sure to find something that interests you.
              </p>
            </div>

            <div className="bg-white dark:bg-dark-card p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Connect With Others
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Meet like-minded people, make new friends, and expand your professional network at events.
              </p>
            </div>

            <div className="bg-white dark:bg-dark-card p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                Simple & Secure
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Register for events with confidence. Our platform is secure, fast, and easy to use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-primary-500 to-cyan-400">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                2,500+
              </div>
              <p className="text-lg text-white/90">
                Events Hosted
              </p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                50,000+
              </div>
              <p className="text-lg text-white/90">
                Registered Users
              </p>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                500+
              </div>
              <p className="text-lg text-white/90">
                Active Organizers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Call to Action Section */}
      <CTASection />
    </MainLayout>
  );
};

export default Home;
