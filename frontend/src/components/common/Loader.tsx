import { FC } from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  message?: string;
}

const Loader: FC<LoaderProps> = ({
  size = 'md',
  fullScreen = false,
  message,
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const spinner = (
    <div className={`${sizeClasses[size]} animate-spin`}>
      <svg
        className="w-full h-full text-primary-500"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-50">
        <div className="bg-white dark:bg-dark-card rounded-lg p-8 flex flex-col items-center gap-4">
          {spinner}
          {message && (
            <p className="text-gray-700 dark:text-gray-200 text-center">{message}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {spinner}
      {message && (
        <p className="text-gray-700 dark:text-gray-200 text-center">{message}</p>
      )}
    </div>
  );
};

export default Loader;
