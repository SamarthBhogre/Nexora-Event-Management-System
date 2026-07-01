import { FC, FormEvent, useEffect, useMemo, useState } from 'react';
import MainLayout from '@components/layout/MainLayout';
import Loader from '@components/common/Loader';
import DashboardProfile from '@components/dashboard/DashboardProfile';
import Button from '@components/common/Button';
import { authService } from '@services/authService';
import { userService, DashboardSummary, UserProfile } from '@services/userService';
import { Attendee, eventService, Event, EventCreateInput, RegistrationStats } from '@services/eventService';

type FieldErrors = Record<string, string[]>;

const emptyEventForm: EventCreateInput = {
  title: '',
  description: '',
  date: '',
  time: '',
  location: '',
  category: '',
  capacity: 50,
  image: '',
  price: 0,
};

const OrganizerDashboard: FC = () => {
  const userId = authService.getCurrentUser()?.id;
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [organizedEvents, setOrganizedEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [attendeeSearch, setAttendeeSearch] = useState('');
  const [registrationStats, setRegistrationStats] = useState<RegistrationStats | null>(null);
  const [eventForm, setEventForm] = useState<EventCreateInput>(emptyEventForm);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const upcomingOwnEvents = useMemo(
    () => organizedEvents.filter((event) => event.status === 'upcoming').length,
    [organizedEvents]
  );

  const loadDashboardData = async (activeUserId: string) => {
    const [profileData, dashboardData, organizedData] = await Promise.all([
      userService.getProfile(activeUserId),
      userService.getDashboard(activeUserId),
      userService.getOrganizedEvents(activeUserId, 1, 12),
    ]);

    setProfile(profileData);
    setSummary(dashboardData);
    setOrganizedEvents(organizedData.items);
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
        const [profileData, dashboardData, organizedData] = await Promise.all([
          userService.getProfile(userId),
          userService.getDashboard(userId),
          userService.getOrganizedEvents(userId, 1, 12),
        ]);

        if (isActive) {
          setProfile(profileData);
          setSummary(dashboardData);
          setOrganizedEvents(organizedData.items);
        }
      } catch (error) {
        if (isActive) {
          console.error('Failed to load organizer dashboard:', error);
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

  const refreshOrganizerData = async () => {
    if (!userId) {
      return;
    }
    await loadDashboardData(userId);
  };

  const resetForm = () => {
    setEditingEventId(null);
    setEventForm(emptyEventForm);
    setFormError(null);
    setFieldErrors({});
  };

  const readSaveError = (error: any): { message: string; details: FieldErrors } => {
    const response = error.response?.data;
    const details = response?.error?.details || {};
    const detailMessages = Object.entries(details)
      .flatMap(([field, messages]) => {
        const values = Array.isArray(messages) ? messages : [String(messages)];
        return values.map((message) => `${field}: ${message}`);
      });

    return {
      message: detailMessages.length
        ? detailMessages.join(' ')
        : response?.message || 'Could not save event. Please check the event details and try again.',
      details,
    };
  };

  const validateEventForm = (): FieldErrors => {
    const errors: FieldErrors = {};

    if (eventForm.title.trim().length < 5) {
      errors.title = ['Title must be at least 5 characters'];
    }
    if (eventForm.description.trim().length < 10) {
      errors.description = ['Description must be at least 10 characters'];
    }
    if (!eventForm.category.trim()) {
      errors.category = ['Category is required'];
    }
    if (!eventForm.date) {
      errors.date = ['Date is required'];
    }
    if (!eventForm.time) {
      errors.time = ['Time is required'];
    }
    if (eventForm.location.trim().length < 3) {
      errors.location = ['Location must be at least 3 characters'];
    }
    if (eventForm.capacity < 1 || eventForm.capacity > 10000) {
      errors.capacity = ['Capacity must be between 1 and 10000'];
    }
    if (eventForm.price < 0) {
      errors.price = ['Price cannot be negative'];
    }

    return errors;
  };

  const handleSubmitEvent = async (event: FormEvent) => {
    event.preventDefault();
    setActionMessage(null);
    setFormError(null);
    setFieldErrors({});

    const validationErrors = validateEventForm();
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setFormError('Please fix the highlighted fields before creating the event.');
      return;
    }

    try {
      if (editingEventId) {
        await eventService.updateEvent(editingEventId, eventForm);
        setActionMessage('Event updated successfully.');
      } else {
        await eventService.createEvent(eventForm);
        setActionMessage('Event created successfully.');
      }
      resetForm();
      try {
        await refreshOrganizerData();
      } catch (refreshError) {
        console.error('Event saved, but dashboard refresh failed:', refreshError);
        setActionMessage('Event saved successfully. Refresh the page to reload dashboard details.');
      }
    } catch (error: any) {
      const saveError = readSaveError(error);
      setFormError(saveError.message);
      setFieldErrors(saveError.details);
      setActionMessage(null);
    }
  };

  const handleEditEvent = (event: Event) => {
    setEditingEventId(event.id);
    setEventForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      location: event.location,
      category: event.category,
      capacity: event.capacity,
      image: event.image,
      price: event.price,
    });
    setActionMessage(`Editing ${event.title}.`);
  };

  const runEventAction = async (label: string, action: () => Promise<unknown>) => {
    setActionMessage(null);
    try {
      await action();
      await refreshOrganizerData();
      setActionMessage(label);
    } catch (error: any) {
      setActionMessage(error.response?.data?.message || 'Action failed.');
    }
  };

  const loadAttendees = async (event: Event, search = attendeeSearch) => {
    setSelectedEvent(event);
    const [attendeeData, statsData] = await Promise.all([
      eventService.getAttendees(event.id, search),
      eventService.getRegistrationStats(event.id),
    ]);
    setAttendees(attendeeData);
    setRegistrationStats(statsData);
  };

  const handleAttendeeSearch = async () => {
    if (selectedEvent) {
      await loadAttendees(selectedEvent, attendeeSearch);
    }
  };

  const handleRemoveAttendee = async (attendee: Attendee) => {
    if (!selectedEvent) {
      return;
    }
    await runEventAction(`Removed ${attendee.name} from ${selectedEvent.title}.`, async () => {
      await eventService.removeAttendee(selectedEvent.id, attendee.userId);
      await loadAttendees(selectedEvent);
    });
  };

  const handleExportAttendees = () => {
    if (!selectedEvent) {
      return;
    }
    const rows = ['Name,Email,Status,Registered At', ...attendees.map((attendee) =>
      [attendee.name, attendee.email, attendee.status, attendee.registeredAt]
        .map((value) => `"${String(value).replace(/"/g, '""')}"`)
        .join(',')
    )];
    const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${selectedEvent.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-attendees.csv`;
    link.click();
    URL.revokeObjectURL(url);
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
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">Organizer Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Monitor your events and attendee activity.</p>
        </div>
      </section>

      {profile && (
        <DashboardProfile
          profile={profile}
          message={`Welcome back, ${profile.name}! Manage your events and attendees.`}
          showOrganization
        />
      )}

      <section className="py-8">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-5 rounded-xl bg-white dark:bg-dark-card shadow-md">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Events Created</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary?.totalOrganizedEvents ?? 0}</p>
          </div>
          <div className="p-5 rounded-xl bg-white dark:bg-dark-card shadow-md">
            <p className="text-sm text-gray-500 dark:text-gray-400">Upcoming Events</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{upcomingOwnEvents}</p>
          </div>
          <div className="p-5 rounded-xl bg-white dark:bg-dark-card shadow-md">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Registrations</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary?.totalRegistrations ?? 0}</p>
          </div>
          <div className="p-5 rounded-xl bg-white dark:bg-dark-card shadow-md">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Attendees</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary?.totalAttendees ?? 0}</p>
          </div>
          <div className="p-5 rounded-xl bg-white dark:bg-dark-card shadow-md">
            <p className="text-sm text-gray-500 dark:text-gray-400">Event Performance</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{summary?.eventPerformance ?? 0}%</p>
          </div>
        </div>
      </section>

      <section className="pb-8">
        <div className="container mx-auto px-4">
          <form onSubmit={handleSubmitEvent} className="bg-white dark:bg-dark-card rounded-lg shadow-md p-5 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingEventId ? 'Edit Event' : 'Create Event'}
              </h2>
              {editingEventId && <Button type="button" variant="outline" size="sm" onClick={resetForm}>Cancel Edit</Button>}
            </div>
            <div className="rounded-lg border border-primary-200 bg-primary-50 p-4 text-sm text-primary-900 dark:border-primary-800 dark:bg-primary-900/20 dark:text-primary-100">
              <p className="font-semibold">Event requirements</p>
              <p className="mt-1">
                Title must be at least 5 characters, description at least 10 characters, date uses YYYY-MM-DD,
                time uses 24-hour HH:mm, capacity must be 1 to 10000, and price cannot be negative.
              </p>
            </div>
            {formError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-900/20 dark:text-red-300">
                <p className="font-semibold">Could not create event</p>
                <p className="mt-1">{formError}</p>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Event Title</label>
                <input className="w-full px-3 py-2 rounded-lg border dark:bg-dark-bg dark:border-gray-700 dark:text-white" placeholder="Title" value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} required />
                {fieldErrors.title && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.title.join(', ')}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                <input className="w-full px-3 py-2 rounded-lg border dark:bg-dark-bg dark:border-gray-700 dark:text-white" placeholder="Category" value={eventForm.category} onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })} required />
                {fieldErrors.category && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.category.join(', ')}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                <input className="w-full px-3 py-2 rounded-lg border dark:bg-dark-bg dark:border-gray-700 dark:text-white" type="date" value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} required />
                {fieldErrors.date && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.date.join(', ')}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Time</label>
                <input className="w-full px-3 py-2 rounded-lg border dark:bg-dark-bg dark:border-gray-700 dark:text-white" type="time" value={eventForm.time} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })} required />
                {fieldErrors.time && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.time.join(', ')}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                <input className="w-full px-3 py-2 rounded-lg border dark:bg-dark-bg dark:border-gray-700 dark:text-white" placeholder="Location" value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} required />
                {fieldErrors.location && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.location.join(', ')}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Capacity</label>
                <input className="w-full px-3 py-2 rounded-lg border dark:bg-dark-bg dark:border-gray-700 dark:text-white" type="number" min="1" placeholder="Capacity" value={eventForm.capacity} onChange={(e) => setEventForm({ ...eventForm, capacity: Number(e.target.value) })} required />
                {fieldErrors.capacity && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.capacity.join(', ')}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Price</label>
                <input className="w-full px-3 py-2 rounded-lg border dark:bg-dark-bg dark:border-gray-700 dark:text-white" type="number" min="0" step="0.01" placeholder="Price" value={eventForm.price} onChange={(e) => setEventForm({ ...eventForm, price: Number(e.target.value) })} required />
                {fieldErrors.price && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.price.join(', ')}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Image URL</label>
                <input className="w-full px-3 py-2 rounded-lg border dark:bg-dark-bg dark:border-gray-700 dark:text-white" placeholder="Image URL" value={eventForm.image || ''} onChange={(e) => setEventForm({ ...eventForm, image: e.target.value })} />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
              <textarea className="w-full px-3 py-2 rounded-lg border dark:bg-dark-bg dark:border-gray-700 dark:text-white" placeholder="Description" value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} required />
              {fieldErrors.description && <p className="mt-1 text-xs text-red-600 dark:text-red-400">{fieldErrors.description.join(', ')}</p>}
            </div>
            <Button type="submit">{editingEventId ? 'Save Event' : 'Create Event'}</Button>
          </form>
          {actionMessage && <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">{actionMessage}</p>}
        </div>
      </section>

      <section className="pb-8">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5">Events You Organize</h2>
          <div className="space-y-4">
            {organizedEvents.map((event) => (
              <div key={event.id} className="bg-white dark:bg-dark-card rounded-lg shadow-md p-5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">{event.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{event.date} at {event.time} - {event.attendees}/{event.capacity} attendees - {event.status}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleEditEvent(event)}>Edit</Button>
                    <Button size="sm" variant="outline" onClick={() => runEventAction('Event duplicated.', () => eventService.duplicateEvent(event.id))}>Duplicate</Button>
                    <Button size="sm" variant="secondary" onClick={() => runEventAction('Publication status updated.', () => eventService.publishEvent(event.id, event.status === 'cancelled'))}>
                      {event.status === 'cancelled' ? 'Publish' : 'Unpublish'}
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => runEventAction('Event cancelled.', () => eventService.cancelEvent(event.id))}>Cancel Event</Button>
                    <Button size="sm" variant="outline" onClick={() => loadAttendees(event)}>Manage Attendees</Button>
                    <Button size="sm" variant="danger" onClick={() => runEventAction('Event deleted.', () => eventService.deleteEvent(event.id))}>Delete</Button>
                  </div>
                </div>
              </div>
            ))}
            {!organizedEvents.length && (
              <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-5 text-gray-600 dark:text-gray-400">
                You have not created any events yet.
              </div>
            )}
          </div>
        </div>
      </section>

      {selectedEvent && (
        <section className="pb-12">
          <div className="container mx-auto px-4">
            <div className="bg-white dark:bg-dark-card rounded-lg shadow-md p-5">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Attendees for {selectedEvent.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Registered {registrationStats?.registered ?? 0}, cancelled {registrationStats?.cancelled ?? 0}, fill rate {registrationStats?.fillRate ?? 0}%
                  </p>
                </div>
                <Button variant="outline" size="sm" onClick={handleExportAttendees}>Export Attendee List</Button>
              </div>
              <div className="flex gap-2 mb-4">
                <input className="flex-1 px-3 py-2 rounded-lg border dark:bg-dark-bg dark:border-gray-700 dark:text-white" placeholder="Search attendees" value={attendeeSearch} onChange={(e) => setAttendeeSearch(e.target.value)} />
                <Button variant="outline" onClick={handleAttendeeSearch}>Search</Button>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {attendees.map((attendee) => (
                  <div key={attendee.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">{attendee.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{attendee.email} - {attendee.status}</p>
                    </div>
                    <Button variant="danger" size="sm" onClick={() => handleRemoveAttendee(attendee)}>Remove Attendee</Button>
                  </div>
                ))}
                {!attendees.length && <p className="py-3 text-gray-600 dark:text-gray-400">No attendees found.</p>}
              </div>
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
};

export default OrganizerDashboard;
