import { FC } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@context/ThemeContext';
import ThemeToggle from '@components/common/ThemeToggle';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  footerText?: React.ReactNode;
}

const AuthLayout: FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  footerText,
}) => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${isDark ? 'dark' : ''}`}>
      {/* Left side - Branding */}
      <div
        className={`hidden md:flex md:w-1/2 flex-col justify-between p-12 transition-colors duration-300 ${
          isDark
            ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
            : 'bg-gradient-to-br from-primary-50 via-blue-50 to-cyan-50'
        }`}
      >
        <div>
          <Link to="/" className="text-3xl font-bold">
            <span className="bg-gradient-to-r from-primary-500 to-cyan-400 bg-clip-text text-transparent">
              Nexora
            </span>
          </Link>
          <p className={`mt-4 text-lg font-medium transition-colors ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Discover, Organize & Join Amazing Events
          </p>
        </div>

        <div className={`space-y-3 transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          <p className="flex items-center gap-2">✨ <span>Connect with your community</span></p>
          <p className="flex items-center gap-2">🎯 <span>Find events that matter to you</span></p>
          <p className="flex items-center gap-2">🚀 <span>Create unforgettable experiences</span></p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className={`w-full md:w-1/2 flex flex-col justify-between p-6 md:p-12 transition-colors duration-300 ${
        isDark ? 'bg-slate-950' : 'bg-white'
      }`}>
        {/* Header */}
        <div className="flex justify-between items-center mb-8 md:mb-0">
          <Link to="/" className="text-2xl font-bold md:hidden">
            <span className="bg-gradient-to-r from-primary-500 to-cyan-400 bg-clip-text text-transparent">
              Nexora
            </span>
          </Link>
          <ThemeToggle />
        </div>

        {/* Form Content */}
        <div className="flex-1 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            <h1 className={`text-4xl font-bold mb-3 transition-colors ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {title}
            </h1>
            {subtitle && (
              <p className={`text-base mb-8 transition-colors ${
                isDark ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {subtitle}
              </p>
            )}

            {children}
          </div>
        </div>

        {/* Footer */}
        {footerText && (
          <div className={`mt-8 text-center text-sm transition-colors ${
            isDark ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {footerText}
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthLayout;
