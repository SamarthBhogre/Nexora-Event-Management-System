import { FC } from 'react';
import { Calendar, MapPin, Users } from 'lucide-react';
import { Event } from '@services/eventService';
import Button from '@components/common/Button';

interface EventCardProps {
  event: Event;
  actionLabel?: string;
  onAction?: (event: Event) => void;
  actionDisabled?: boolean;
}

const EventCard: FC<EventCardProps> = ({ event, actionLabel = 'View Details', onAction, actionDisabled = false }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const capacityPercent = (event.attendees / event.capacity) * 100;

  return (
    <div className="group h-full overflow-hidden rounded-xl shadow-md hover:shadow-xl dark:shadow-dark-card/50 transition-all duration-300 bg-white dark:bg-dark-card hover:scale-105">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-gray-200 dark:bg-gray-700 h-48">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/500x300?text=' + encodeURIComponent(event.title);
          }}
        />
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
            event.status === 'upcoming'
              ? 'bg-blue-500'
              : event.status === 'ongoing'
              ? 'bg-green-500'
              : event.status === 'completed'
              ? 'bg-gray-500'
              : 'bg-red-500'
          }`}>
            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/90 dark:bg-dark-bg/90 text-gray-900 dark:text-white">
            {event.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col h-[calc(100%-12rem)] justify-between">
        {/* Title */}
        <div>
          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors">
            {event.title}
          </h3>

          {/* Date and Location */}
          <div className="space-y-1.5 mb-3">
            <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar size={16} className="flex-shrink-0 mt-0.5" />
              <span>{formatDate(event.date)} at {event.time}</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin size={16} className="flex-shrink-0 mt-0.5" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>
        </div>

        {/* Capacity */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
              <Users size={16} />
              <span>{event.attendees}/{event.capacity}</span>
            </div>
            <span className="text-xs text-gray-500 dark:text-gray-500">
              {Math.round(capacityPercent)}% full
            </span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-500 to-cyan-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(capacityPercent, 100)}%` }}
            />
          </div>
        </div>

        {/* Button */}
        <div className="mt-4">
          <Button
            variant="primary"
            size="sm"
            fullWidth
            className="text-sm"
            disabled={actionDisabled}
            onClick={() => onAction?.(event)}
          >
            {actionLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
