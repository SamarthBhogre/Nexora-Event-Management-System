import { FC } from 'react';
import AuthLayout from '@components/auth/AuthLayout';
import SignupForm from '@components/auth/SignupForm';

const Signup: FC = () => {
  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join our community and start discovering amazing events"
      footerText={
        <>
          <p>
            Already have an account?{' '}
            <a href="/login" className="text-primary-500 hover:text-primary-600 font-semibold">
              Sign in
            </a>
          </p>
        </>
      }
    >
      <SignupForm />
    </AuthLayout>
  );
};

export default Signup;
