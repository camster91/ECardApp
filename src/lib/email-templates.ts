import { formatDateTime, escapeHtml } from "@/lib/utils";

interface InvitationEmailParams {
  guestName: string;
  eventTitle: string;
  eventDate: string | null;
  locationName: string | null;
  rsvpUrl: string;
  hostName?: string;
}

export function buildInvitationEmail(params: InvitationEmailParams): {
  subject: string;
  html: string;
} {
  const { guestName, eventTitle, eventDate, locationName, rsvpUrl } = params;

  const safeGuestName = escapeHtml(guestName);
  const safeEventTitle = escapeHtml(eventTitle);
  const safeLocationName = locationName ? escapeHtml(locationName) : null;

  const subject = `You're invited: ${safeEventTitle}`;

  const dateBlock = eventDate
    ? `<tr>
        <td style="padding:4px 0;color:#6b7280;font-size:14px;">When</td>
        <td style="padding:4px 0 4px 12px;font-size:14px;">${escapeHtml(formatDateTime(eventDate))}</td>
      </tr>`
    : "";

  const locationBlock = safeLocationName
    ? `<tr>
        <td style="padding:4px 0;color:#6b7280;font-size:14px;">Where</td>
        <td style="padding:4px 0 4px 12px;font-size:14px;">${safeLocationName}</td>
      </tr>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px 24px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:600;">You're Invited!</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:24px;">
              <p style="margin:0 0 16px;font-size:15px;color:#374151;">
                Hi ${safeGuestName},
              </p>
              <p style="margin:0 0 20px;font-size:15px;color:#374151;">
                You've been invited to <strong>${safeEventTitle}</strong>.
              </p>

              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                ${dateBlock}
                ${locationBlock}
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${rsvpUrl}" style="display:inline-block;background:#6366f1;color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:15px;font-weight:600;">
                      RSVP Now
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:16px 24px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                Sent via ECardApp
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html };
}

interface ReminderEmailParams {
  guestName: string;
  eventTitle: string;
  eventDate: string | null;
  locationName: string | null;
  rsvpUrl: string;
}

export function buildReminderEmail(params: ReminderEmailParams): {
  subject: string;
  html: string;
} {
  const { guestName, eventTitle, eventDate, locationName, rsvpUrl } = params;

  const safeGuestName = escapeHtml(guestName);
  const safeEventTitle = escapeHtml(eventTitle);
  const safeLocationName = locationName ? escapeHtml(locationName) : null;

  const subject = `Reminder: ${safeEventTitle}`;

  const dateBlock = eventDate
    ? `<tr>
        <td style="padding:4px 0;color:#6b7280;font-size:14px;">When</td>
        <td style="padding:4px 0 4px 12px;font-size:14px;">${escapeHtml(formatDateTime(eventDate))}</td>
      </tr>`
    : "";

  const locationBlock = safeLocationName
    ? `<tr>
        <td style="padding:4px 0;color:#6b7280;font-size:14px;">Where</td>
        <td style="padding:4px 0 4px 12px;font-size:14px;">${safeLocationName}</td>
      </tr>`
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#f59e0b,#d97706);padding:32px 24px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:600;">Don't Forget!</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:24px;">
              <p style="margin:0 0 16px;font-size:15px;color:#374151;">
                Hi ${safeGuestName},
              </p>
              <p style="margin:0 0 20px;font-size:15px;color:#374151;">
                Just a friendly reminder about <strong>${safeEventTitle}</strong>.
              </p>

              <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
                ${dateBlock}
                ${locationBlock}
              </table>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${rsvpUrl}" style="display:inline-block;background:#d97706;color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:15px;font-weight:600;">
                      View Event
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:16px 24px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                Sent via ECardApp
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html };
}

interface AnnouncementEmailParams {
  guestName: string;
  eventTitle: string;
  announcementSubject: string;
  announcementMessage: string;
  rsvpUrl: string;
}

export function buildAnnouncementEmail(params: AnnouncementEmailParams): {
  subject: string;
  html: string;
} {
  const { guestName, eventTitle, announcementSubject, announcementMessage, rsvpUrl } = params;

  const safeGuestName = escapeHtml(guestName);
  const safeEventTitle = escapeHtml(eventTitle);
  const safeSubject = escapeHtml(announcementSubject);
  const safeMessage = escapeHtml(announcementMessage).replace(/\n/g, '<br>');

  const subject = `Event Update: ${safeSubject}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background-color:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#059669,#047857);padding:32px 24px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:600;">Event Update</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:24px;">
              <p style="margin:0 0 16px;font-size:15px;color:#374151;">
                Hi ${safeGuestName},
              </p>
              <p style="margin:0 0 8px;font-size:15px;color:#374151;">
                Update regarding <strong>${safeEventTitle}</strong>:
              </p>
              <div style="margin:16px 0;padding:16px;background:#f0fdf4;border-radius:8px;border-left:4px solid #059669;">
                <p style="margin:0 0 8px;font-size:16px;font-weight:600;color:#065f46;">${safeSubject}</p>
                <p style="margin:0;font-size:14px;color:#374151;line-height:1.6;">${safeMessage}</p>
              </div>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="${rsvpUrl}" style="display:inline-block;background:#059669;color:#ffffff;text-decoration:none;padding:12px 32px;border-radius:8px;font-size:15px;font-weight:600;">
                      View Event
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:16px 24px;border-top:1px solid #e5e7eb;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                Sent via ECardApp
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html };
}
