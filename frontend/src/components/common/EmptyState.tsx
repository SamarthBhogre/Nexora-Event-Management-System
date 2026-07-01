import { FC } from 'react';
import { Search, Package } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  icon?: 'search' | 'package' | 'custom';
  customIcon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: FC<EmptyStateProps> = ({
  icon = 'package',
  customIcon,
  title,
  description,
  action,
}) => {
  const getIcon = () => {
    if (customIcon) return customIcon;
    switch (icon) {
      case 'search':
        return <Search size={48} />;
      case 'package':
        return <Package size={48} />;
      default:
        return <Package size={48} />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-gray-400 dark:text-gray-500 mb-4">
        {getIcon()}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
        {description}
      </p>
      {action && (
        <Button
          variant="primary"
          onClick={action.onClick}
        >
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
