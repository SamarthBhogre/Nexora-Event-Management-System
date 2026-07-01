import { FC, useEffect, useState } from 'react';
import MainLayout from '@components/layout/MainLayout';
import Loader from '@components/common/Loader';
import EventGrid from '@components/events/EventGrid';
import DashboardProfile from '@components/dashboard/DashboardProfile';
import Button from '@components/common/Button';
import { authService } from '@services/authService';
import { userService, DashboardSummary, UserProfile } from '@services/userService';
import { eventService, Event } from '@services/eventService';

const UserDashboard: FC = () => {
  const userId = authService.getCurrentUser()?.id;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [registeredEvents, setRegisteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    let isActive = true;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [profileData, dashboardData, registeredData] = await Promise.all([
          userService.getProfile(userId),
          userService.getDashboard(userId),
          userService.getRegisteredEvents(userId, 1, 6),
        ]);

        if (isActive) {
          setProfile(profileData);
          setSummary(dashboardData);
          setRegisteredEvents(registeredData.items);
        }
      } catch (error) {
        if (isActive) {
          console.error('Failed to load user dashboard:', error);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadData();

    return () => {
      isActive = false;
    };
  }, [userId]);

  const handleCancelRegistration = async (event: Event) => {
    setActionMessage(null);
    try {
      await eventService.unregisterFromEvent(event.id);
      setRegisteredEvents((prev) => prev.filter((item) => item.id !== event.id));
      setSummary((prev) =>
        prev ? { ...prev, totalRegistrations: Math.max(0, prev.totalRegistrations - 1) } : prev
      );
      setActionMessage(`Registration cancelled for ${event.title}.`);
    } catch (error: any) {
      setActionMessage(error.response?.data?.message || 'Could not cancel registration.');
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="py-20 flex justify-center">
          <Loader size="lg" message="Loading dashboard..." />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <section className="py-12 bg-gradient-to-r from-primary-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">User Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Track your registrations and upcoming plans.</p>
        </div>
      </section>

      {profile && (
        <DashboardProfile
          profile={profile}
          message={`Welcome back, ${profile.name}! Here are your upcoming events.`}
        />
      )}

      <section className="py-8">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-white dark:bg-dark-card shadow-md">
            <p className="text-sm text-gray-500 dark:text-gray-400">Registered Events</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary?.totalRegistrations ?? 0}</p>
          </div>
          <div className="p-5 rounded-xl bg-white dark:bg-dark-card shadow-md">
            <p className="text-sm text-gray-500 dark:text-gray-400">Upcoming Events</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary?.upcomingEvents ?? 0}</p>
          </div>
          <div className="p-5 rounded-xl bg-white dark:bg-dark-card shadow-md">
            <p className="text-sm text-gray-500 dark:text-gray-400">Role Capabilities</p>
            <p className="text-base font-semibold text-gray-900 dark:text-white">Browse, register, and manage your registrations</p>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button variant="outline" onClick={() => { window.location.href = '/events'; }}>View Public Events</Button>
            <Button variant="outline" onClick={() => { window.location.href = '/events'; }}>Search Events</Button>
            <Button variant="secondary" onClick={() => { window.location.href = '/events'; }}>Filter Events</Button>
          </div>
          {actionMessage && (
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{actionMessage}</p>
          )}
        </div>
      </section>

      <section className="pb-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">Your Registered Events</h2>
          <EventGrid
            events={registeredEvents}
            emptyMessage="You have not registered for any events yet."
            actionLabel="Cancel Registration"
            onAction={handleCancelRegistration}
          />
        </div>
      </section>
    </MainLayout>
  );
};

export default UserDashboard;
