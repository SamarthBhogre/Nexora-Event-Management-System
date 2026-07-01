import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@components/layout/MainLayout';
import CategoryCard from '@components/categories/CategoryCard';
import Loader from '@components/common/Loader';
import { eventService, Category } from '@services/eventService';

const Categories: FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      setIsLoading(true);
      try {
        const data = await eventService.getCategories();
        setCategories(data);
      } catch (error) {
        console.error('Error loading categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleCategoryClick = (categoryId: string) => {
    navigate(`/events?category=${categoryId}`);
  };

  return (
    <MainLayout>
      {/* Page Header */}
      <section className="py-12 bg-gradient-to-r from-primary-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">
            Event Categories
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse events by category and find what interests you
          </p>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader size="lg" message="Loading categories..." />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  onClick={() => handleCategoryClick(category.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="py-12 bg-primary-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Can't find what you're looking for?
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Use our search feature to find specific events or check back regularly for new categories.
            </p>
            <a
              href="/events"
              className="inline-block px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-semibold"
            >
              Browse All Events
            </a>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Categories;
