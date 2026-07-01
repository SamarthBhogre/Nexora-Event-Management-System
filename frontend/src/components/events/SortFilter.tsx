import { FC, useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface SortFilterProps {
  value: 'date' | 'popularity' | 'title';
  onChange: (value: 'date' | 'popularity' | 'title') => void;
}

const SortFilter: FC<SortFilterProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sortOptions = [
    { value: 'date', label: 'Newest First' },
    { value: 'popularity', label: 'Most Popular' },
    { value: 'title', label: 'Alphabetical' },
  ] as const;

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

  const handleSelectSort = (sortValue: 'date' | 'popularity' | 'title') => {
    onChange(sortValue);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 hover:border-primary-500 dark:hover:border-primary-400 transition-colors text-left"
        aria-label="Sort options"
      >
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
          Sort: {sortOptions.find(opt => opt.value === value)?.label}
        </span>
        <ChevronDown 
          size={18} 
          className={`ml-auto text-gray-400 dark:text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 min-w-[200px] animate-in fade-in slide-in-from-top-1 duration-200">
          <div className="p-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelectSort(option.value)}
                className={`w-full text-left px-3 py-2.5 rounded-lg transition-colors ${
                  value === option.value
                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortFilter;
