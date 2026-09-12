'use client';

import { type ReactNode, forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarStack } from './Avatar';
import { Badge, Tag, Pill } from './Badge';
import { Button } from './Button';
import { Heart, Users, MapPin, Sparkles, Coffee, ShieldCheck, Check, Clock, CalendarDays, MessageCircle, Star, Bookmark, Flag, Plus, X, ChevronRight, Send, ArrowRight, LoaderCircle } from 'lucide-react';

export interface Person {
  id: string;
  name: string;
  age: number;
  city: string;
  distance: number;
  bio: string;
  intent: 'Relationship' | 'Friendship' | 'Dating' | 'Activity partners';
  interests: string[];
  image: string;
  verified: boolean;
  online: boolean;
  compatibility: number;
  demo?: boolean;
}

export interface PersonCardProps {
  person: Person;
  liked?: boolean;
  onLike?: () => void;
  onClick?: () => void;
  onMessage?: () => void;
  showActions?: boolean;
  compact?: boolean;
  className?: string;
}

export function PersonCard({
  person,
  liked = false,
  onLike,
  onClick,
  onMessage,
  showActions = true,
  compact = false,
  className,
}: PersonCardProps) {
  const intentIcons = {
    Relationship: Heart,
    Friendship: Users,
    Dating: Heart,
    'Activity partners': Coffee,
  };

  const intentColors = {
    Relationship: 'text-error-default bg-error-surface',
    Friendship: 'text-brand-purple bg-brand-purple/10',
    Dating: 'text-error-default bg-error-surface',
    'Activity partners': 'text-success-default bg-success-surface',
  };

  const IntentIcon = intentIcons[person.intent];

  return (
    <article
      className={cn(
        'bg-white rounded-2xl border border-border-subtle overflow-hidden transition-all duration-base',
        'hover:shadow-card-hover hover:border-border-strong',
        compact && 'flex',
        className
      )}
      onClick={onClick}
    >
      <div className={cn('relative overflow-hidden', compact ? 'w-48 flex-shrink-0' : 'aspect-[4/5]')}>
        <img
          src={person.image}
          alt={`${person.name}, ${person.age}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden="true" />

        <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-2">
          <Badge variant="brand" size="sm" dot>
            <Sparkles className="w-3 h-3" aria-hidden="true" />
            {person.demo === false ? 'New to Zivora' : `${person.compatibility}% compatible`}
          </Badge>
          {person.verified && (
            <Badge variant="success" size="sm" icon={<ShieldCheck className="w-3 h-3" aria-hidden="true" />}>
              Verified
            </Badge>
          )}
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
          <Badge variant="subtle" icon={<IntentIcon className="w-3 h-3" aria-hidden="true" />} className={intentColors[person.intent]}>
            {person.intent === 'Relationship' ? 'Looking for a relationship' : person.intent}
          </Badge>
          {person.online && (
            <Badge variant="success" size="xs" dot>
              Online
            </Badge>
          )}
        </div>
      </div>

      <div className={cn('p-4', compact && 'flex-1 flex flex-col justify-center')}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-fg-primary truncate">{person.name}, {person.age}</h3>
              {person.verified && (
                <svg className="w-5 h-5 text-success-default flex-shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-label="Verified">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              )}
            </div>
            <p className="mt-1 text-sm text-fg-secondary flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
              <span>{person.city}</span>
              <span aria-hidden="true">·</span>
              <span>{person.distance < 0 ? 'Local connection' : `${person.distance} km away`}</span>
            </p>
          </div>
        </div>

        {person.bio && !compact && (
          <p className="text-sm text-fg-secondary mb-3 line-clamp-2">{person.bio}</p>
        )}

        <div className="flex flex-wrap gap-2 mb-3" role="list" aria-label="Interests">
          {person.interests.slice(0, compact ? 2 : 3).map((interest, index) => (
            <Tag key={interest} variant="default" size="sm">
              {interest}
            </Tag>
          ))}
          {person.interests.length > (compact ? 2 : 3) && (
            <Tag variant="default" size="sm">
              +{person.interests.length - (compact ? 2 : 3)}
            </Tag>
          )}
        </div>

        {showActions && (
          <div className="flex items-center justify-between pt-3 border-t border-border-subtle">
            <div className="flex items-center gap-2">
              {onMessage && (
                <Button variant="ghost" size="sm" onClick={onMessage} icon={<MessageCircle className="w-4 h-4" />} aria-label={`Message ${person.name}`}>
                  Message
                </Button>
              )}
            </div>
            <Button
              variant={liked ? 'danger' : 'ghost'}
              size="sm"
              onClick={onLike}
              aria-label={liked ? `Unlike ${person.name}` : `Like ${person.name}`}
              aria-pressed={liked}
              icon={<Heart className={cn('w-4 h-4', liked && 'fill-current')} />}
            />
          </div>
        )}
      </div>
    </article>
  );
}

export interface Community {
  id: string;
  title: string;
  description: string;
  category: string;
  city: string;
  image: string;
  members: number;
  capacity?: number;
  ownerId?: string;
  joined?: boolean;
}

export interface CommunityCardProps {
  community: Community;
  joined?: boolean;
  onJoin?: () => void;
  onClick?: () => void;
  showAvatars?: boolean;
  avatars?: Array<{ name: string; image?: string }>;
  className?: string;
}

export function CommunityCard({
  community,
  joined = false,
  onJoin,
  onClick,
  showAvatars = true,
  avatars = [],
  className,
}: CommunityCardProps) {
  return (
    <article
      className={cn(
        'bg-white rounded-2xl border border-border-subtle overflow-hidden transition-all duration-base',
        'hover:shadow-card-hover hover:border-border-strong',
        className
      )}
      onClick={onClick}
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={community.image}
          alt={community.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden="true" />
        <div className="absolute bottom-3 left-3 right-3">
          <Badge variant="brand" size="sm">{community.category}</Badge>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-fg-primary line-clamp-1 mb-2">{community.title}</h3>
        <p className="text-sm text-fg-secondary flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
          <span>{community.members.toLocaleString()} members</span>
          <span aria-hidden="true">·</span>
          <span>{community.city}</span>
        </p>

        {showAvatars && avatars.length > 0 && (
          <div className="mb-3">
            <AvatarStack avatars={avatars} max={4} size="sm" />
          </div>
        )}

        {onJoin && (
          <Button
            variant={joined ? 'secondary' : 'primary'}
            size="sm"
            fullWidth
            onClick={onJoin}
            icon={joined ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            disabled={community.capacity ? community.members >= community.capacity && !joined : false}
          >
            {joined ? 'Joined' : community.capacity && community.members >= community.capacity ? 'Currently full' : 'Join community'}
          </Button>
        )}
      </div>
    </article>
  );
}

export interface Event {
  id: string;
  title: string;
  description: string;
  category: string;
  city: string;
  location: string;
  date: string;
  image: string;
  members: number;
  capacity: number;
  joined?: boolean;
  saved?: boolean;
}

export interface EventCardProps {
  event: Event;
  joined?: boolean;
  saved?: boolean;
  onJoin?: () => void;
  onSave?: () => void;
  onClick?: () => void;
  compact?: boolean;
  showAvatars?: boolean;
  avatars?: Array<{ name: string; image?: string }>;
  className?: string;
}

export function EventCard({
  event,
  joined = false,
  saved = false,
  onJoin,
  onSave,
  onClick,
  compact = false,
  showAvatars = true,
  avatars = [],
  className,
}: EventCardProps) {
  const eventDate = new Date(event.date);
  const day = eventDate.getDate();
  const month = eventDate.toLocaleString('en', { month: 'short' }).toUpperCase();

  return (
    <article
      className={cn(
        'bg-white rounded-2xl border border-border-subtle overflow-hidden transition-all duration-base',
        'hover:shadow-card-hover hover:border-border-strong',
        compact && 'flex',
        className
      )}
      onClick={onClick}
    >
      <div className={cn('relative overflow-hidden', compact ? 'w-56 flex-shrink-0' : 'aspect-video')}>
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" aria-hidden="true" />

        <div className="absolute top-3 left-3 flex flex-col items-start gap-2">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl p-2 text-center min-w-[52px]">
            <span className="block text-lg font-bold text-fg-primary">{day}</span>
            <span className="block text-xs font-semibold text-fg-tertiary uppercase">{month}</span>
          </div>
          <Badge variant="brand" size="sm">{event.category}</Badge>
        </div>

        {saved && (
          <button
            onClick={(e) => { e.stopPropagation(); onSave?.(); }}
            className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-sm rounded-xl hover:bg-white transition-colors"
            aria-label={saved ? 'Unsave event' : 'Save event'}
            aria-pressed={saved}
          >
            <Bookmark className={cn('w-5 h-5', saved ? 'fill-current text-brand-purple' : 'text-fg-tertiary')} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className={cn('p-4', compact && 'flex-1 flex flex-col justify-between')}>
        <div>
          <h3 className="font-bold text-fg-primary line-clamp-1 mb-2">{event.title}</h3>
          <p className="text-sm text-fg-secondary flex items-center gap-2 mb-1">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            <span>{event.location}</span>
          </p>
          <p className="text-sm text-fg-secondary flex items-center gap-2 mb-3">
            <Clock className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            <span>{eventDate.toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</span>
          </p>

          {showAvatars && avatars.length > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <AvatarStack avatars={avatars} max={3} size="sm" />
              <span className="text-sm text-fg-secondary"><b>{event.members}</b> going</span>
            </div>
          )}
        </div>

        {onJoin && (
          <Button
            variant={joined ? 'secondary' : 'primary'}
            size="sm"
            fullWidth
            onClick={onJoin}
            disabled={event.members >= event.capacity && !joined}
          >
            {joined ? 'You\'re going' : event.members >= event.capacity ? 'Currently full' : 'Count me in'}
          </Button>
        )}
      </div>
    </article>
  );
}

export interface Resource {
  id: string;
  kind: 'community' | 'event' | 'creator' | 'meeting';
  ownerId: string;
  title: string;
  description: string;
  category: string;
  city: string;
  image: string;
  location: string;
  date: string;
  capacity: number;
  members: number;
  status: string;
  createdAt: string;
}

export function ResourceCard({
  resource,
  onClick,
  onAction,
  actionLabel,
  actionVariant = 'primary',
  className,
}: {
  resource: Resource;
  onClick?: () => void;
  onAction?: () => void;
  actionLabel?: string;
  actionVariant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
}) {
  const isEvent = resource.kind === 'event';

  return (
    <article
      className={cn(
        'bg-white rounded-2xl border border-border-subtle overflow-hidden transition-all duration-base',
        'hover:shadow-card-hover hover:border-border-strong',
        className
      )}
      onClick={onClick}
    >
      <div className={cn('relative overflow-hidden', isEvent ? 'aspect-video' : 'aspect-[4/3]')}>
        <img
          src={resource.image}
          alt={resource.title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute bottom-3 left-3 right-3">
          <Badge variant="brand" size="sm">{resource.category}</Badge>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-fg-primary line-clamp-1 mb-2">{resource.title}</h3>
        <p className="text-sm text-fg-secondary flex items-center gap-2 mb-3">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
          <span>{resource.city}</span>
        </p>

        {isEvent && (
          <p className="text-sm text-fg-secondary flex items-center gap-2 mb-3">
            <CalendarDays className="w-3.5 h-3.5 flex-shrink-0" aria-hidden="true" />
            <span>{new Date(resource.date).toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}</span>
          </p>
        )}

        {actionLabel && onAction && (
          <Button variant={actionVariant} size="sm" fullWidth onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </article>
  );
}