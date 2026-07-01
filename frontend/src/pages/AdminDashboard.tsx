import { FC, useEffect, useMemo, useState } from 'react';
import MainLayout from '@components/layout/MainLayout';
import Loader from '@components/common/Loader';
import DashboardProfile from '@components/dashboard/DashboardProfile';
import Button from '@components/common/Button';
import { authService } from '@services/authService';
import { userService, DashboardSummary, UserProfile } from '@services/userService';
import { eventService, Event } from '@services/eventService';

const AdminDashboard: FC = () => {
  const userId = authService.getCurrentUser()?.id;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserProfile['role'] | ''>('');
  const [statusFilter, setStatusFilter] = useState<'active' | 'suspended' | ''>('');
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const organizers = useMemo(() => users.filter((user) => user.role === 'organizer'), [users]);

  const loadDashboardData = async (activeUserId: string) => {
    const [profileData, dashboardData, eventsData, usersData] = await Promise.all([
      userService.getProfile(activeUserId),
      userService.getDashboard(activeUserId),
      eventService.getEvents({ page: 1, limit: 12, sortBy: 'date' }),
      userService.listUsers({
        page: 1,
        limit: 12,
        search: userSearch || undefined,
        role: roleFilter || undefined,
        status: statusFilter || undefined,
      }),
    ]);

    setProfile(profileData);
    setSummary(dashboardData);
    setEvents(eventsData.items);
    setUsers(usersData.items);
  };

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    let isActive = true;

    const loadData = async () => {
      setIsLoading(true);
      try {
        const [profileData, dashboardData, eventsData, usersData] = await Promise.all([
          userService.getProfile(userId),
          userService.getDashboard(userId),
          eventService.getEvents({ page: 1, limit: 12, sortBy: 'date' }),
          userService.listUsers({ page: 1, limit: 12 }),
        ]);

        if (isActive) {
          setProfile(profileData);
          setSummary(dashboardData);
          setEvents(eventsData.items);
          setUsers(usersData.items);
        }
      } catch (error) {
        if (isActive) {
          console.error('Failed to load admin dashboard:', error);
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

  const refreshAdminData = async () => {
    if (!userId) {
      return;
    }
    await loadDashboardData(userId);
  };

  const runAdminAction = async (message: string, action: () => Promise<unknown>) => {
    setActionMessage(null);
    try {
      await action();
      await refreshAdminData();
      setActionMessage(message);
    } catch (error: any) {
      setActionMessage(error.response?.data?.message || 'Action failed.');
    }
  };

  const handleSearchUsers = async () => {
    await refreshAdminData();
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Platform-wide overview and content control.</p>
        </div>
      </section>

      {profile && (
        <DashboardProfile
          profile={profile}
          message={`Welcome back, ${profile.name}! Monitor and manage the Nexora platform.`}
          showStatus
        />
      )}

      <section className="py-8">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            ['Total Users', summary?.totalUsers],
            ['Total Organizers', summary?.totalOrganizers],
            ['Total Events', summary?.totalEvents],
            ['Active Events', summary?.activeEvents],
            ['Completed Events', summary?.completedEvents],
            ['Total Registrations', summary?.totalRegistrations],
            ['Monthly Users', summary?.monthlyUsers],
            ['Monthly Events', summary?.monthlyEvents],
          ].map(([label, value]) => (
            <div key={label} className="p-5 rounded-xl bg-white dark:bg-dark-card shadow-md">
              <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{value ?? 0}</p>
            </div>
          ))}
        </div>
      </section>

      {actionMessage && (
        <section className="pb-4">
          <div className="container mx-auto px-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">{actionMessage}</p>
          </div>
        </section>
      )}

      <section className="pb-8">
        <div className="container mx-auto px-4">
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-5">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">User Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
              <input className="px-3 py-2 rounded-lg border dark:bg-dark-bg dark:border-gray-700 dark:text-white" placeholder="Search users" value={userSearch} onChange={(event) => setUserSearch(event.target.value)} />
              <select className="px-3 py-2 rounded-lg border dark:bg-dark-bg dark:border-gray-700 dark:text-white" value={roleFilter} onChange={(event) => setRoleFilter(event.target.value as UserProfile['role'] | '')}>
                <option value="">All roles</option>
                <option value="user">Users</option>
                <option value="organizer">Organizers</option>
                <option value="admin">Admins</option>
              </select>
              <select className="px-3 py-2 rounded-lg border dark:bg-dark-bg dark:border-gray-700 dark:text-white" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value as 'active' | 'suspended' | '')}>
                <option value="">All statuses</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
              <Button variant="outline" onClick={handleSearchUsers}>Apply Filters</Button>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <div key={user.id} className="py-3 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{user.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{user.email} - {user.role} - {user.accountStatus || 'active'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => runAdminAction('User role changed to user.', () => userService.changeRole(user.id, 'user'))}>Make User</Button>
                    <Button size="sm" variant="outline" onClick={() => runAdminAction('User role changed to organizer.', () => userService.changeRole(user.id, 'organizer'))}>Make Organizer</Button>
                    <Button size="sm" variant="secondary" onClick={() => runAdminAction('User activated.', () => userService.changeStatus(user.id, 'active'))}>Activate</Button>
                    <Button size="sm" variant="secondary" onClick={() => runAdminAction('User suspended.', () => userService.changeStatus(user.id, 'suspended'))}>Suspend</Button>
                    <Button size="sm" variant="danger" onClick={() => runAdminAction('User deleted.', () => userService.deleteUser(user.id))}>Delete</Button>
                  </div>
                </div>
              ))}
              {!users.length && <p className="py-3 text-gray-600 dark:text-gray-400">No users found.</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="container mx-auto px-4">
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-5">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Organizer Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {organizers.map((organizer) => (
                <div key={organizer.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <p className="font-semibold text-gray-900 dark:text-white">{organizer.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{organizer.organizationName || 'No organization listed'}</p>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => runAdminAction('Organizer activated.', () => userService.changeStatus(organizer.id, 'active'))}>Approve</Button>
                    <Button size="sm" variant="danger" onClick={() => runAdminAction('Organizer suspended.', () => userService.changeStatus(organizer.id, 'suspended'))}>Suspend</Button>
                  </div>
                </div>
              ))}
              {!organizers.length && <p className="text-gray-600 dark:text-gray-400">No organizers in the current filter.</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="container mx-auto px-4">
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-5">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Event Moderation</h2>
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{event.title}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{event.organizer} - {event.status} - {event.date}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => runAdminAction('Event restored.', () => eventService.moderateEvent(event.id, 'restore'))}>Restore</Button>
                    <Button size="sm" variant="secondary" onClick={() => runAdminAction('Event featured.', () => eventService.moderateEvent(event.id, 'feature'))}>Feature</Button>
                    <Button size="sm" variant="secondary" onClick={() => runAdminAction('Event archived.', () => eventService.moderateEvent(event.id, 'archive'))}>Archive</Button>
                    <Button size="sm" variant="danger" onClick={() => runAdminAction('Event removed.', () => eventService.moderateEvent(event.id, 'remove'))}>Remove</Button>
                  </div>
                </div>
              ))}
              {!events.length && <p className="text-gray-600 dark:text-gray-400">No events available for moderation.</p>}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Reports</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">Recent users: {users.slice(0, 5).map((user) => user.name).join(', ') || 'none'}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Recent events: {events.slice(0, 5).map((event) => event.title).join(', ') || 'none'}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Monthly registrations: {summary?.monthlyRegistrations ?? 0}</p>
          </div>
          <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Settings</h2>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => { window.location.href = '/categories'; }}>Categories</Button>
              <Button variant="outline" disabled>Platform Settings</Button>
              <Button variant="outline" disabled>General Configuration</Button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default AdminDashboard;
