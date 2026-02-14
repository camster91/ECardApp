import twilio from "twilio";

let client: ReturnType<typeof twilio> | null = null;

export function getTwilioClient() {
  if (!client) {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const apiKeySid = process.env.TWILIO_API_KEY_SID;
    const apiKeySecret = process.env.TWILIO_API_KEY_SECRET;
    const authToken = process.env.TWILIO_AUTH_TOKEN;

    if (accountSid && apiKeySid && apiKeySecret) {
      // Use API Key authentication
      client = twilio(apiKeySid, apiKeySecret, { accountSid });
    } else if (accountSid && authToken) {
      // Use Account SID + Auth Token authentication
      client = twilio(accountSid, authToken);
    } else {
      throw new Error(
        "Missing Twilio credentials. Set TWILIO_ACCOUNT_SID + TWILIO_AUTH_TOKEN, or TWILIO_ACCOUNT_SID + TWILIO_API_KEY_SID + TWILIO_API_KEY_SECRET"
      );
    }
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
  const hasAccountSid = !!process.env.TWILIO_ACCOUNT_SID;
  const hasAuthToken = !!process.env.TWILIO_AUTH_TOKEN;
  const hasApiKey = !!process.env.TWILIO_API_KEY_SID && !!process.env.TWILIO_API_KEY_SECRET;
  const hasFromNumber = !!process.env.TWILIO_FROM_NUMBER;

  return hasAccountSid && (hasAuthToken || hasApiKey) && hasFromNumber;
}
