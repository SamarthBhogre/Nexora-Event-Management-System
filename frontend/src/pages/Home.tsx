import { FC } from 'react';
import MainLayout from '@components/layout/MainLayout';
import HeroSection from '@components/sections/HeroSection';
import FeaturesSection from '@components/sections/FeaturesSection';
import CTASection from '@components/sections/CTASection';

const Home: FC = () => {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturesSection />
      <CTASection />
    </MainLayout>
  );
};

export default Home;
