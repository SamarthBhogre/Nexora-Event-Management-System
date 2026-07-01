import { FC, HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  shadow?: 'sm' | 'md' | 'lg' | 'xl';
}

const Card: FC<CardProps> = ({
  children,
  hover = false,
  shadow = 'md',
  className,
  ...props
}) => {
  const shadowStyles = {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  const classes = [
    'bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700',
    shadowStyles[shadow],
    hover && 'transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-105',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;
