import { formatDateTime } from "@/lib/utils";

interface InviteSmsParams {
  guestName: string;
  eventTitle: string;
  eventDate: string | null;
  locationName: string | null;
  hostName?: string;
  rsvpUrl: string;
}

export function buildInviteSms(params: InviteSmsParams): string {
  const { guestName, eventTitle, eventDate, locationName, hostName, rsvpUrl } = params;

  const lines: string[] = [];
  lines.push(`Hi ${guestName}! You're invited to ${eventTitle}.`);

  if (eventDate) {
    lines.push(`When: ${formatDateTime(eventDate)}`);
  }
  if (locationName) {
    lines.push(`Where: ${locationName}`);
  }
  if (hostName) {
    lines.push(`Host: ${hostName}`);
  }

  lines.push(`\nRSVP here: ${rsvpUrl}`);
  lines.push(`\n- Sent via ECardApp`);

  return lines.join("\n");
}

interface ReminderSmsParams {
  guestName: string;
  eventTitle: string;
  eventDate: string | null;
  rsvpUrl: string;
}

export function buildReminderSms(params: ReminderSmsParams): string {
  const { guestName, eventTitle, eventDate, rsvpUrl } = params;

  const lines: string[] = [];
  lines.push(`Hi ${guestName}, reminder about ${eventTitle}!`);

  if (eventDate) {
    lines.push(`Date: ${formatDateTime(eventDate)}`);
  }

  lines.push(`\nView event: ${rsvpUrl}`);
  lines.push(`\n- Sent via ECardApp`);

  return lines.join("\n");
}

interface AnnouncementSmsParams {
  guestName: string;
  eventTitle: string;
  subject: string;
  rsvpUrl: string;
}

export function buildAnnouncementSms(params: AnnouncementSmsParams): string {
  const { guestName, eventTitle, subject, rsvpUrl } = params;

  return `Hi ${guestName}, update for ${eventTitle}: ${subject}\n\nDetails: ${rsvpUrl}\n\n- Sent via ECardApp`;
}
