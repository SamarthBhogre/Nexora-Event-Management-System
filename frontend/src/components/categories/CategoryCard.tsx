import { FC } from 'react';
import { Category } from '@services/eventService';
import Button from '@components/common/Button';

interface CategoryCardProps {
  category: Category;
  onClick?: () => void;
}

const CategoryCard: FC<CategoryCardProps> = ({ category, onClick }) => {
  return (
    <div className="group h-full overflow-hidden rounded-xl shadow-md hover:shadow-lg dark:shadow-dark-card/50 transition-all duration-300 bg-white dark:bg-dark-card hover:scale-105 cursor-pointer p-6 flex flex-col items-center justify-center text-center">
      {/* Icon */}
      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">
        {category.icon}
      </div>

      {/* Name */}
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-500 transition-colors">
        {category.name}
      </h3>

      {/* Description */}
      {category.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {category.description}
        </p>
      )}

      {/* Event Count */}
      <div className="mb-4">
        <p className="text-sm font-semibold text-primary-500">
          {category.eventCount} {category.eventCount === 1 ? 'Event' : 'Events'}
        </p>
      </div>

      {/* Button */}
      <Button
        variant="primary"
        size="sm"
        fullWidth
        onClick={onClick}
      >
        Explore
      </Button>
    </div>
  );
};

export default CategoryCard;
