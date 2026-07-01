import { FC } from 'react';
import { Link } from 'react-router-dom';
import Button from '@components/common/Button';
import { authService } from '@services/authService';
import type { UserProfile } from '@services/userService';

interface DashboardProfileProps {
  profile: UserProfile;
  message: string;
  showOrganization?: boolean;
  showStatus?: boolean;
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

const labelize = (value?: string | null) =>
  (value || 'active').charAt(0).toUpperCase() + (value || 'active').slice(1);

const DashboardProfile: FC<DashboardProfileProps> = ({
  profile,
  message,
  showOrganization = false,
  showStatus = false,
}) => {
  const initials = profile.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = async () => {
    await authService.logout();
    window.location.href = '/';
  };

  return (
    <section className="py-8 border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4">
        <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-16 h-16 rounded-full object-cover" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 flex items-center justify-center text-xl font-bold">
                  {initials || 'N'}
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{message}</h2>
                <p className="text-gray-600 dark:text-gray-400">{profile.name} - {profile.email}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Link to="/profile/edit">
                <Button variant="outline" size="sm">Edit Profile</Button>
              </Link>
              <Link to="/profile/password">
                <Button variant="secondary" size="sm">Change Password</Button>
              </Link>
              <Button variant="danger" size="sm" onClick={handleLogout}>Logout</Button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
            <div>
              <p className="text-gray-500 dark:text-gray-400">Full Name</p>
              <p className="font-semibold text-gray-900 dark:text-white">{profile.name}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Email Address</p>
              <p className="font-semibold text-gray-900 dark:text-white">{profile.email}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Role</p>
              <p className="font-semibold text-gray-900 dark:text-white">{labelize(profile.role)}</p>
            </div>
            <div>
              <p className="text-gray-500 dark:text-gray-400">Member Since</p>
              <p className="font-semibold text-gray-900 dark:text-white">{formatDate(profile.createdAt)}</p>
            </div>
            {showOrganization && (
              <div>
                <p className="text-gray-500 dark:text-gray-400">Organization Name</p>
                <p className="font-semibold text-gray-900 dark:text-white">{profile.organizationName || 'Not provided'}</p>
              </div>
            )}
            {showStatus && (
              <div>
                <p className="text-gray-500 dark:text-gray-400">Account Status</p>
                <p className="font-semibold text-gray-900 dark:text-white">{labelize(profile.accountStatus)}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardProfile;
