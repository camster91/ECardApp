'use client';

import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import type { WizardFormData } from './WizardContainer';

interface EventDetailsFormValues {
  title: string;
  description: string;
  event_date: string;
  event_end_date: string;
  location_name: string;
  location_address: string;
}

interface StepEventDetailsProps {
  data: EventDetailsFormValues;
  onUpdate: (field: keyof WizardFormData, value: unknown) => void;
}

export default function StepEventDetails({ data, onUpdate }: StepEventDetailsProps) {
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<EventDetailsFormValues>({
    defaultValues: data,
    mode: 'onChange',
  });

  // Sync form changes back to wizard state
  const watchedValues = watch();

  useEffect(() => {
    const fields: (keyof EventDetailsFormValues)[] = [
      'title',
      'description',
      'event_date',
      'event_end_date',
      'location_name',
      'location_address',
    ];

    fields.forEach((field) => {
      if (watchedValues[field] !== data[field]) {
        onUpdate(field, watchedValues[field]);
      }
    });
  }, [watchedValues, data, onUpdate]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Event Details</h2>
        <p className="mt-1 text-sm text-gray-500">
          Fill in the basic information about your event.
        </p>
      </div>

      <div className="space-y-5">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Event Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            {...register('title', {
              required: 'Event title is required',
              minLength: { value: 2, message: 'Title must be at least 2 characters' },
              maxLength: { value: 200, message: 'Title must be less than 200 characters' },
            })}
            placeholder="e.g. Sarah & Tom's Wedding"
            className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
          {errors.title && (
            <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            {...register('description', {
              maxLength: { value: 2000, message: 'Description must be less than 2000 characters' },
            })}
            rows={3}
            placeholder="Tell your guests what to expect..."
            className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
          {errors.description && (
            <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
          )}
        </div>

        {/* Date fields side by side */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="event_date" className="block text-sm font-medium text-gray-700">
              Start Date & Time
            </label>
            <input
              id="event_date"
              type="datetime-local"
              {...register('event_date')}
              className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label htmlFor="event_end_date" className="block text-sm font-medium text-gray-700">
              End Date & Time
            </label>
            <input
              id="event_end_date"
              type="datetime-local"
              {...register('event_end_date')}
              className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Location fields */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="location_name" className="block text-sm font-medium text-gray-700">
              Venue Name
            </label>
            <input
              id="location_name"
              type="text"
              {...register('location_name')}
              placeholder="e.g. Grand Ballroom"
              className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          <div>
            <label htmlFor="location_address" className="block text-sm font-medium text-gray-700">
              Address
            </label>
            <input
              id="location_address"
              type="text"
              {...register('location_address')}
              placeholder="e.g. 123 Main St, City, State"
              className="mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
