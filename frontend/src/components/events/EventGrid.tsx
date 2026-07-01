import { FC } from 'react';
import { Event } from '@services/eventService';
import EventCard from './EventCard';
import EmptyState from '@components/common/EmptyState';

interface EventGridProps {
  events: Event[];
  isLoading?: boolean;
  emptyMessage?: string;
  onRetry?: () => void;
  actionLabel?: string;
  onAction?: (event: Event) => void;
  actionDisabled?: (event: Event) => boolean;
}

const EventGrid: FC<EventGridProps> = ({
  events,
  isLoading,
  emptyMessage = 'No events found. Check back later!',
  onRetry,
  actionLabel,
  onAction,
  actionDisabled,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="bg-gray-200 dark:bg-gray-700 rounded-xl h-80 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <EmptyState
        icon="search"
        title="No Events Found"
        description={emptyMessage}
        action={
          onRetry
            ? {
              label: 'Try Again',
              onClick: onRetry,
            }
            : undefined
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard
          key={event.id}
          event={event}
          actionLabel={actionLabel}
          onAction={onAction}
          actionDisabled={actionDisabled?.(event)}
        />
      ))}
    </div>
  );
};

export default EventGrid;
