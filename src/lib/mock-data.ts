import type {
  Event,
  RSVPField,
  Guest,
  GuestTag,
  RSVPResponse,
} from "@/types/database";
import { DEFAULT_CUSTOMIZATION, DEFAULT_RSVP_FIELDS } from "./constants";
import { nanoid } from "nanoid";

// ---------------------------------------------------------------------------
// In-memory stores (reset on server restart — fine for MVP demo)
// ---------------------------------------------------------------------------

const events = new Map<string, Event>();
const rsvpFields = new Map<string, RSVPField[]>(); // keyed by event_id
const guests = new Map<string, Guest[]>(); // keyed by event_id
const guestTags = new Map<string, GuestTag[]>(); // keyed by event_id
const rsvpResponses = new Map<string, RSVPResponse[]>(); // keyed by event_id

// ---------------------------------------------------------------------------
// Seed data
// ---------------------------------------------------------------------------

const DEMO_USER_ID = "demo-user-001";
const now = new Date().toISOString();

function seedIfEmpty() {
  if (events.size > 0) return;

  const event1: Event = {
    id: "evt-001",
    user_id: DEMO_USER_ID,
    title: "Sarah & James Wedding",
    description:
      "Join us for a beautiful celebration of love as Sarah and James tie the knot. Dinner, dancing, and joy await!",
    event_date: new Date(Date.now() + 30 * 86400000).toISOString(),
    event_end_date: null,
    location_name: "The Grand Ballroom",
    location_address: "123 Main St, New York, NY 10001",
    location_lat: null,
    location_lng: null,
    design_url: null,
    design_type: "image",
    customization: { ...DEFAULT_CUSTOMIZATION },
    slug: "sarah-james-wedding",
    status: "published",
    tier: "free",
    max_responses: 15,
    payment_id: null,
    created_at: now,
    updated_at: now,
  };

  const event2: Event = {
    id: "evt-002",
    user_id: DEMO_USER_ID,
    title: "Company Holiday Party 2026",
    description:
      "End the year in style! Join us for an evening of food, drinks, and fun with your colleagues.",
    event_date: new Date(Date.now() + 60 * 86400000).toISOString(),
    event_end_date: null,
    location_name: "Rooftop Lounge",
    location_address: "456 Park Ave, New York, NY 10022",
    location_lat: null,
    location_lng: null,
    design_url: null,
    design_type: "image",
    customization: {
      ...DEFAULT_CUSTOMIZATION,
      primaryColor: "#3b82f6",
    },
    slug: "holiday-party-2026",
    status: "draft",
    tier: "free",
    max_responses: 15,
    payment_id: null,
    created_at: now,
    updated_at: now,
  };

  events.set(event1.id, event1);
  events.set(event2.id, event2);

  // Seed RSVP fields for both events
  for (const evt of [event1, event2]) {
    const fields: RSVPField[] = DEFAULT_RSVP_FIELDS.map((f, i) => ({
      id: `field-${evt.id}-${i}`,
      event_id: evt.id,
      field_name: f.field_name,
      field_label: f.field_label,
      field_type: f.field_type,
      options: "options" in f ? (f.options as string[]) : null,
      placeholder: "placeholder" in f ? (f.placeholder as string) : null,
      is_required: f.is_required,
      is_enabled: f.is_enabled,
      sort_order: f.sort_order,
      created_at: now,
    }));
    rsvpFields.set(evt.id, fields);
  }

  // Seed some responses for event1
  const responses: RSVPResponse[] = [
    {
      id: "resp-001",
      event_id: event1.id,
      guest_id: null,
      respondent_name: "Alice Johnson",
      respondent_email: "alice@example.com",
      status: "attending",
      response_data: {},
      headcount: 2,
      submitted_at: now,
    },
    {
      id: "resp-002",
      event_id: event1.id,
      guest_id: null,
      respondent_name: "Bob Smith",
      respondent_email: "bob@example.com",
      status: "attending",
      response_data: {},
      headcount: 1,
      submitted_at: now,
    },
    {
      id: "resp-003",
      event_id: event1.id,
      guest_id: null,
      respondent_name: "Carol Williams",
      respondent_email: "carol@example.com",
      status: "not_attending",
      response_data: {},
      headcount: 1,
      submitted_at: now,
    },
  ];
  rsvpResponses.set(event1.id, responses);

  // Seed some guests for event1
  const seedGuests: Guest[] = [
    {
      id: "guest-001",
      event_id: event1.id,
      name: "Alice Johnson",
      email: "alice@example.com",
      phone: null,
      notes: null,
      created_at: now,
      updated_at: now,
    },
    {
      id: "guest-002",
      event_id: event1.id,
      name: "Bob Smith",
      email: "bob@example.com",
      phone: null,
      notes: null,
      created_at: now,
      updated_at: now,
    },
  ];
  guests.set(event1.id, seedGuests);
}

// ---------------------------------------------------------------------------
// Events CRUD
// ---------------------------------------------------------------------------

export function getEvents(userId: string): Event[] {
  seedIfEmpty();
  return Array.from(events.values())
    .filter((e) => e.user_id === userId)
    .sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export function getEventById(eventId: string, userId?: string): Event | null {
  seedIfEmpty();
  const evt = events.get(eventId) ?? null;
  if (evt && userId && evt.user_id !== userId) return null;
  return evt;
}

export function getEventBySlug(slug: string): Event | null {
  seedIfEmpty();
  return (
    Array.from(events.values()).find(
      (e) => e.slug === slug && e.status === "published"
    ) ?? null
  );
}

export function createEvent(
  userId: string,
  data: Partial<Event>
): Event {
  seedIfEmpty();
  const id = `evt-${nanoid(8)}`;
  const slug = `${(data.title ?? "event").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${nanoid(6)}`;
  const evt: Event = {
    id,
    user_id: userId,
    title: data.title ?? "Untitled Event",
    description: data.description ?? null,
    event_date: data.event_date ?? null,
    event_end_date: data.event_end_date ?? null,
    location_name: data.location_name ?? null,
    location_address: data.location_address ?? null,
    location_lat: null,
    location_lng: null,
    design_url: data.design_url ?? null,
    design_type: data.design_type ?? "image",
    customization: data.customization ?? { ...DEFAULT_CUSTOMIZATION },
    slug,
    status: "draft",
    tier: "free",
    max_responses: 15,
    payment_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  events.set(id, evt);

  // Create default RSVP fields
  const fields: RSVPField[] = DEFAULT_RSVP_FIELDS.map((f, i) => ({
    id: `field-${id}-${i}`,
    event_id: id,
    field_name: f.field_name,
    field_label: f.field_label,
    field_type: f.field_type,
    options: "options" in f ? (f.options as string[]) : null,
    placeholder: "placeholder" in f ? (f.placeholder as string) : null,
    is_required: f.is_required,
    is_enabled: f.is_enabled,
    sort_order: f.sort_order,
    created_at: new Date().toISOString(),
  }));
  rsvpFields.set(id, fields);

  return evt;
}

export function updateEvent(
  eventId: string,
  data: Partial<Event>
): Event | null {
  const evt = events.get(eventId);
  if (!evt) return null;
  const updated = { ...evt, ...data, updated_at: new Date().toISOString() };
  events.set(eventId, updated);
  return updated;
}

export function deleteEvent(eventId: string): boolean {
  rsvpFields.delete(eventId);
  guests.delete(eventId);
  guestTags.delete(eventId);
  rsvpResponses.delete(eventId);
  return events.delete(eventId);
}

// ---------------------------------------------------------------------------
// RSVP Fields
// ---------------------------------------------------------------------------

export function getRsvpFields(eventId: string): RSVPField[] {
  seedIfEmpty();
  return (rsvpFields.get(eventId) ?? []).sort(
    (a, b) => a.sort_order - b.sort_order
  );
}

export function setRsvpFields(eventId: string, fields: RSVPField[]): RSVPField[] {
  rsvpFields.set(eventId, fields);
  return fields;
}

// ---------------------------------------------------------------------------
// Guests
// ---------------------------------------------------------------------------

export function getGuests(eventId: string): Guest[] {
  seedIfEmpty();
  return guests.get(eventId) ?? [];
}

export function createGuest(eventId: string, data: Partial<Guest>): Guest {
  seedIfEmpty();
  const g: Guest = {
    id: `guest-${nanoid(8)}`,
    event_id: eventId,
    name: data.name ?? "",
    email: data.email ?? null,
    phone: data.phone ?? null,
    notes: data.notes ?? null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  const list = guests.get(eventId) ?? [];
  list.push(g);
  guests.set(eventId, list);
  return g;
}

export function updateGuest(
  eventId: string,
  guestId: string,
  data: Partial<Guest>
): Guest | null {
  const list = guests.get(eventId);
  if (!list) return null;
  const idx = list.findIndex((g) => g.id === guestId);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], ...data, updated_at: new Date().toISOString() };
  return list[idx];
}

export function deleteGuest(eventId: string, guestId: string): boolean {
  const list = guests.get(eventId);
  if (!list) return false;
  const idx = list.findIndex((g) => g.id === guestId);
  if (idx === -1) return false;
  list.splice(idx, 1);
  return true;
}

// ---------------------------------------------------------------------------
// Guest Tags
// ---------------------------------------------------------------------------

export function getGuestTags(eventId: string): GuestTag[] {
  seedIfEmpty();
  return guestTags.get(eventId) ?? [];
}

export function createGuestTag(
  eventId: string,
  tagName: string,
  color: string
): GuestTag {
  const tag: GuestTag = {
    id: `tag-${nanoid(8)}`,
    event_id: eventId,
    tag_name: tagName,
    color,
    created_at: new Date().toISOString(),
  };
  const list = guestTags.get(eventId) ?? [];
  list.push(tag);
  guestTags.set(eventId, list);
  return tag;
}

export function deleteGuestTag(eventId: string, tagId: string): boolean {
  const list = guestTags.get(eventId);
  if (!list) return false;
  const idx = list.findIndex((t) => t.id === tagId);
  if (idx === -1) return false;
  list.splice(idx, 1);
  return true;
}

// ---------------------------------------------------------------------------
// RSVP Responses
// ---------------------------------------------------------------------------

export function getResponses(eventId: string): RSVPResponse[] {
  seedIfEmpty();
  return rsvpResponses.get(eventId) ?? [];
}

export function createResponse(
  eventId: string,
  data: Partial<RSVPResponse>
): RSVPResponse {
  seedIfEmpty();
  const r: RSVPResponse = {
    id: `resp-${nanoid(8)}`,
    event_id: eventId,
    guest_id: data.guest_id ?? null,
    respondent_name: data.respondent_name ?? "",
    respondent_email: data.respondent_email ?? null,
    status: data.status ?? "pending",
    response_data: data.response_data ?? {},
    headcount: data.headcount ?? 1,
    submitted_at: new Date().toISOString(),
  };
  const list = rsvpResponses.get(eventId) ?? [];
  list.push(r);
  rsvpResponses.set(eventId, list);
  return r;
}

export function deleteResponse(
  eventId: string,
  responseId: string
): boolean {
  const list = rsvpResponses.get(eventId);
  if (!list) return false;
  const idx = list.findIndex((r) => r.id === responseId);
  if (idx === -1) return false;
  list.splice(idx, 1);
  return true;
}

export function getResponseCount(eventId: string): number {
  seedIfEmpty();
  return (rsvpResponses.get(eventId) ?? []).length;
}
