import type { Metadata } from 'next';
import WizardContainer from '@/components/events/wizard/WizardContainer';

export const metadata: Metadata = {
  title: 'Create Event',
};

export default function NewEventPage() {
  return (
    <div className="py-8">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="mb-8 text-2xl font-bold text-gray-900">Create New Event</h1>
        <WizardContainer mode="create" />
      </div>
    </div>
  );
}
