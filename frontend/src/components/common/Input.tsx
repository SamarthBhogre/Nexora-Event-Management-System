import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  icon,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random()}`;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 pointer-events-none">{icon}</div>}

        <input
          ref={ref}
          id={inputId}
          className={[
            'w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg',
            'bg-white dark:bg-gray-700 text-gray-900 dark:text-white',
            'placeholder-gray-400 dark:placeholder-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'transition-all duration-200',
            error && 'border-red-500 dark:border-red-500 focus:ring-red-500',
            icon && 'pl-10',
            className,
          ]
            .filter(Boolean)
            .join(' ')}
          {...props}
        />
      </div>

      {error && <p className="mt-2 text-sm text-red-500 dark:text-red-400">{error}</p>}
      {helperText && !error && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
