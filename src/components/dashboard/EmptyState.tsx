import { CalendarPlus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 bg-white py-16">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
        <CalendarPlus className="h-8 w-8 text-brand-600" />
      </div>
      <h3 className="mt-4 text-lg font-semibold">No events yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Create your first event to get started
      </p>
      <Link href="/events/new" className="mt-6">
        <Button>
          <CalendarPlus className="mr-2 h-4 w-4" />
          Create Event
        </Button>
      </Link>
    </div>
  );
}
