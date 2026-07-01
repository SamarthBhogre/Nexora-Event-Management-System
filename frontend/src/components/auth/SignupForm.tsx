import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Mail } from 'lucide-react';
import { signupSchema, type SignupFormData } from '@validation/signupSchema';
import { authService } from '@services/authService';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import PasswordInput from '@components/common/PasswordInput';

const SignupForm = () => {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const getDashboardPath = (role: 'user' | 'organizer' | 'admin') =>
    `/dashboard/${role === 'admin' ? 'admin' : role === 'organizer' ? 'organizer' : 'user'}`;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema) as any,
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<SignupFormData> = async (data) => {
    setApiError(null);
    try {
      const response = await authService.register(data);
      if (response.success) {
        navigate(getDashboardPath(response.user?.role || 'user'));
      } else {
        setApiError(response.message || 'Signup failed. Please try again.');
      }
    } catch (error) {
      setApiError('An error occurred. Please try again later.');
      console.error('Signup error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {apiError && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-300 rounded-lg animate-in fade-in slide-in-from-top-2">
          <p className="text-red-700 dark:text-red-200 text-sm font-medium">{apiError}</p>
        </div>
      )}

      <div>
        <Input
          label="Full Name"
          type="text"
          placeholder="John Doe"
          icon={<User size={18} />}
          error={errors.fullName?.message}
          {...register('fullName')}
        />
      </div>

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
          placeholder="Create a strong password"
          error={errors.password?.message}
          {...register('password')}
        />
        <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
          Must contain: uppercase, lowercase, number, and be at least 8 characters
        </p>
      </div>

      <div>
        <PasswordInput
          label="Confirm Password"
          placeholder="Re-enter your password"
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1.5">Account Type</label>
        <select
          {...register('userType')}
          className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
        >
          <option value="user">User</option>
          <option value="organizer">Organizer</option>
        </select>
      </div>

      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          {...register('terms')}
          className="w-4 h-4 text-primary-500 rounded border-gray-300 dark:border-gray-600 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-2 transition-colors mt-0.5 flex-shrink-0"
        />
        <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors">
          I agree to the{' '}
          <Link
            to="#"
            className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
          >
            Terms of Service
          </Link>
          {' '}and{' '}
          <Link
            to="#"
            className="text-primary-600 dark:text-primary-400 hover:underline font-medium"
          >
            Privacy Policy
          </Link>
        </span>
      </label>
      {errors.terms && (
        <p className="text-sm text-red-500 dark:text-red-400">{errors.terms.message}</p>
      )}

      <Button
        type="submit"
        fullWidth
        loading={isSubmitting}
        className="py-3 text-base font-semibold"
      >
        {isSubmitting ? 'Creating Account...' : 'Create Account'}
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-slate-950 text-gray-500 dark:text-gray-400">
            Already registered?
          </span>
        </div>
      </div>

      <Link
        to="/login"
        className="block w-full px-4 py-3 text-center text-sm font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/10 hover:bg-primary-100 dark:hover:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg transition-colors"
      >
        Sign In
      </Link>
    </form>
  );
};

export default SignupForm;
