import { FC, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import MainLayout from '@components/layout/MainLayout';
import EventSearch from '@components/events/EventSearch';
import CategoryFilter from '@components/events/CategoryFilter';
import SortFilter from '@components/events/SortFilter';
import EventGrid from '@components/events/EventGrid';
import Loader from '@components/common/Loader';
import Button from '@components/common/Button';
import { eventService, Event, Category } from '@services/eventService';
import { authService } from '@services/authService';

const Events: FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get('category'));
  const [sortBy, setSortBy] = useState<'date' | 'popularity' | 'title'>('date');

  const pageSize = 9;
  const currentUser = authService.getCurrentUser();
  const isAuthenticated = Boolean(currentUser);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await eventService.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      const loadEvents = async () => {
        setIsLoading(true);
        setErrorMessage(null);

        try {
          const response = await eventService.getEvents({
            page,
            limit: pageSize,
            category: selectedCategory || undefined,
            search: searchTerm || undefined,
            sortBy,
          });
          setEvents(response.items);
          setTotal(response.total);
          setHasMore(response.hasMore);
        } catch (error) {
          console.error('Error loading events:', error);
          setErrorMessage('Failed to load events. Please try again.');
        } finally {
          setIsLoading(false);
        }
      };

      loadEvents();
    }, 350);

    return () => clearTimeout(debounce);
  }, [page, searchTerm, selectedCategory, sortBy]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (selectedCategory) {
      params.set('category', selectedCategory);
    } else {
      params.delete('category');
    }
    setSearchParams(params, { replace: true });
  }, [searchParams, selectedCategory, setSearchParams]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / pageSize)), [total]);

  const handleClearSearch = () => {
    setSearchTerm('');
    setPage(1);
  };

  const handleRetry = async () => {
    setPage(1);
    setIsLoading(true);
    try {
      const response = await eventService.getEvents({
        page: 1,
        limit: pageSize,
        category: selectedCategory || undefined,
        search: searchTerm || undefined,
        sortBy,
      });
      setEvents(response.items);
      setTotal(response.total);
      setHasMore(response.hasMore);
      setErrorMessage(null);
    } catch (error) {
      console.error('Error reloading events:', error);
      setErrorMessage('Failed to load events. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (event: Event) => {
    if (!currentUser) {
      setErrorMessage('Please sign in to register for an event.');
      return;
    }

    if (currentUser.role !== 'user') {
      window.location.href = currentUser.role === 'admin' ? '/dashboard/admin' : '/dashboard/organizer';
      return;
    }

    try {
      setIsRegistering(event.id);
      await eventService.registerForEvent(event.id);
      setEvents((prev) =>
        prev.map((item) =>
          item.id === event.id ? { ...item, attendees: Math.min(item.attendees + 1, item.capacity) } : item
        )
      );
      setErrorMessage(null);
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsRegistering(null);
    }
  };

  const getActionLabel = () => {
    if (!isAuthenticated) {
      return 'Sign in to Register';
    }
    if (currentUser?.role === 'organizer') {
      return 'Manage in Dashboard';
    }
    if (currentUser?.role === 'admin') {
      return 'Moderate';
    }
    return 'Register';
  };

  return (
    <MainLayout>
      <section className="py-12 bg-gradient-to-r from-primary-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-2">Discover Events</h1>
          <p className="text-gray-600 dark:text-gray-400">Find and join amazing events in your area</p>
        </div>
      </section>

      <section className="py-8 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4">
          <div className="space-y-4">
            <EventSearch value={searchTerm} onChange={(value) => { setSearchTerm(value); setPage(1); }} onClear={handleClearSearch} />

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <CategoryFilter
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelectCategory={(categoryId) => {
                    setSelectedCategory(categoryId);
                    setPage(1);
                  }}
                />
              </div>
              <div className="flex-1">
                <SortFilter
                  value={sortBy}
                  onChange={(value) => {
                    setSortBy(value);
                    setPage(1);
                  }}
                />
              </div>
            </div>

            {errorMessage && (
              <div className="text-sm text-red-600 dark:text-red-400">
                {errorMessage}
              </div>
            )}

            {!isLoading && (
              <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600 dark:text-gray-400">
                <span>
                  Showing {events.length} of {total} {total === 1 ? 'event' : 'events'}
                </span>
                <span>
                  Page {page} of {totalPages}
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader size="lg" message="Loading events..." />
            </div>
          ) : (
            <>
              <EventGrid
                events={events}
                emptyMessage="No events match your filters. Try adjusting your search criteria."
                onRetry={handleRetry}
                actionLabel={getActionLabel()}
                onAction={handleRegister}
                actionDisabled={(event) =>
                  currentUser?.role === 'user'
                    ? Boolean(isRegistering) || event.attendees >= event.capacity || event.status !== 'upcoming'
                    : false
                }
              />

              {total > pageSize && (
                <div className="mt-8 flex items-center justify-center gap-3">
                  <Button variant="outline" onClick={() => setPage((prev) => Math.max(1, prev - 1))} disabled={page === 1}>
                    Previous
                  </Button>
                  <Button variant="outline" onClick={() => setPage((prev) => prev + 1)} disabled={!hasMore}>
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default Events;
