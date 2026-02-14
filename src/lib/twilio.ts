import twilio from "twilio";

let client: ReturnType<typeof twilio> | null = null;

export function getTwilioClient() {
  if (!client) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    if (!accountSid || !authToken) {
      throw new Error("Missing TWILIO_ACCOUNT_SID or TWILIO_AUTH_TOKEN");
    }
    client = twilio(accountSid, authToken);
  }
  return client;
}

export function getTwilioFromNumber(): string {
  const num = process.env.TWILIO_FROM_NUMBER;
  if (!num) {
    throw new Error("Missing TWILIO_FROM_NUMBER environment variable");
  }
  return num;
}

export function isTwilioConfigured(): boolean {
  return !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_FROM_NUMBER
  );
}
