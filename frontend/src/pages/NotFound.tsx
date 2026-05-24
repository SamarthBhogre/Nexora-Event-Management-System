import { FC } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@components/layout/MainLayout';
import Button from '@components/common/Button';

const NotFound: FC = () => {
  return (
    <MainLayout>
      <section className="py-32 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-gray-900 dark:text-white mb-4">
            404
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Sorry, the page you're looking for doesn't exist or has been moved.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg">
                Go Home
              </Button>
            </Link>
            <Link to="/events">
              <Button variant="outline" size="lg">
                Browse Events
              </Button>
            </Link>
          </div>

          <div className="mt-16">
            <svg
              className="w-64 h-64 mx-auto opacity-10"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={0.5}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default NotFound;
