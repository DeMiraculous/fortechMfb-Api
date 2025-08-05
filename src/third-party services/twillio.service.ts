import { config } from "dotenv";// load environment variables from a .env file into process.env
import twilio from "twilio";

config(); //find.env file (at the root of the project), parses it, and injects the variables into process.env.

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER!;

const client = twilio(accountSid, authToken);

export class TwilioService {
  async sendOtp(phoneNumber: string, otp: string) {
    const message = await client.messages.create({
      body: `Your fortech OTP is: ${otp}`,
      from: twilioPhone,
      to: phoneNumber,
    });

    return message.sid; // You can store or log the message SID
  }
}
