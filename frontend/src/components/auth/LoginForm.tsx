import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail } from 'lucide-react';
import { loginSchema, type LoginFormData } from '@validation/loginSchema';
import { authService } from '@services/authService';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import PasswordInput from '@components/common/PasswordInput';

const LoginForm = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema) as any,
    mode: 'onBlur',
  });

  const getDashboardPath = (role: 'user' | 'organizer' | 'admin') =>
    `/dashboard/${role === 'admin' ? 'admin' : role === 'organizer' ? 'organizer' : 'user'}`;

  const onSubmit: SubmitHandler<LoginFormData> = async (data) => {
    setApiError(null);
    try {
      const response = await authService.login(data);
      if (response.success) {
        if (data.rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('rememberedEmail', data.email);
        }
        navigate(getDashboardPath(response.user?.role || 'user'));
      } else {
        setApiError(response.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      setApiError('An error occurred. Please try again later.');
      console.error('Login error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {apiError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-300 rounded-lg animate-in fade-in slide-in-from-top-2">
          <p className="text-red-700 dark:text-red-200 text-sm font-medium">{apiError}</p>
        </div>
      )}

      <div>
        <Input
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          icon={<Mail size={18} />}
          error={errors.email?.message}
          {...register('email')}
        />
      </div>

      <div>
        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          error={errors.password?.message}
          {...register('password')}
        />
      </div>

      <div className="flex items-center justify-between pt-2">
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <input
            type="checkbox"
            {...register('rememberMe')}
            className="w-4 h-4 text-primary-500 rounded border-gray-300 dark:border-gray-600 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-2 transition-colors"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
            Remember me
          </span>
        </label>
        <Link
          to="/forgot-password"
          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        fullWidth
        loading={isSubmitting}
        className="py-3 text-base font-semibold"
      >
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-slate-950 text-gray-500 dark:text-gray-400">
            New here?
          </span>
        </div>
      </div>

      <Link
        to="/signup"
        className="block w-full px-4 py-3 text-center text-sm font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/10 hover:bg-primary-100 dark:hover:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg transition-colors"
      >
        Create Account
      </Link>

    </form>
  );
};

export default LoginForm;
