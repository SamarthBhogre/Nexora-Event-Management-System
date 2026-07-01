import { FC } from 'react';
import { Search, X } from 'lucide-react';
import Input from '@components/common/Input';

interface EventSearchProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
}

const EventSearch: FC<EventSearchProps> = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search events by name, location, or category...',
}) => {
  return (
    <div className="relative">
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        icon={<Search size={18} />}
        className="pl-10"
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Clear search"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default EventSearch;
