import { FC } from 'react';
import AuthLayout from '@components/auth/AuthLayout';
import LoginForm from '@components/auth/LoginForm';

const Login: FC = () => {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your account to continue"
      footerText={
        <>
          <p>
            Don't have an account?{' '}
            <a href="/signup" className="text-primary-500 hover:text-primary-600 font-semibold">
              Sign up
            </a>
          </p>
        </>
      }
    >
      <LoginForm />
    </AuthLayout>
  );
};

export default Login;
