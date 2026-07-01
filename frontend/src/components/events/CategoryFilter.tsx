import { FC, useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Category } from '@services/eventService';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

const CategoryFilter: FC<CategoryFilterProps> = ({
  categories,
  selectedCategory,
  onSelectCategory,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectCategory = (categoryId: string | null) => {
    onSelectCategory(categoryId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:border-primary-500 dark:hover:border-primary-400 transition-colors text-left"
        aria-label="Filter by category"
      >
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
          {selectedCategory
            ? categories.find(c => c.id === selectedCategory)?.name || 'Category'
            : 'All Categories'}
        </span>
        <ChevronDown 
          size={18} 
          className={`ml-auto text-gray-400 dark:text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="p-2 max-h-80 overflow-y-auto">
            <button
              onClick={() => handleSelectCategory(null)}
              className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                selectedCategory === null
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              All Categories
            </button>

            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleSelectCategory(category.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors flex items-center gap-2 ${
                  selectedCategory === category.id
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                <span className="text-lg">{category.icon}</span>
                <span className="flex-1">{category.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {category.eventCount}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryFilter;
