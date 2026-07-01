import { FC } from 'react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { authService } from '@services/authService';

const CTASection: FC = () => {
  const currentUser = authService.getCurrentUser();
  const secondaryCta = currentUser?.role === 'organizer'
    ? { href: '/dashboard/organizer', label: 'Organizer Dashboard' }
    : currentUser
    ? null
    : { href: '/signup', label: 'Become an Organizer' };

  return (
    <section className="py-20 md:py-32 bg-gradient-to-r from-primary-600 to-primary-700 dark:from-primary-800 dark:to-primary-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          Ready to Explore Events?
        </h2>
        <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
          Join thousands of event enthusiasts and discover amazing experiences in your city. Sign up now and start exploring.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/events">
            <Button 
              size="lg" 
              variant="secondary"
              className="w-full sm:w-auto"
            >
              Browse Events
            </Button>
          </Link>
          {secondaryCta && (
            <Link to={secondaryCta.href}>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-white text-white hover:bg-white/10"
              >
                {secondaryCta.label}
              </Button>
            </Link>
          )}
        </div>

        <div className="mt-12 pt-12 border-t border-primary-500/30">
          <p className="text-primary-100 mb-6">
            Trusted by event organizers and attendees worldwide
          </p>
          <div className="flex items-center justify-center gap-8 flex-wrap opacity-80">
            {['TechHub', 'EventPro', 'CommunityBase', 'EventMaster'].map((partner) => (
              <span key={partner} className="text-white font-semibold text-sm">
                {partner}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
