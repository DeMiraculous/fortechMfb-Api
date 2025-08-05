"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwilioService = void 0;
const dotenv_1 = require("dotenv"); // load environment variables from a .env file into process.env
const twilio_1 = __importDefault(require("twilio"));
(0, dotenv_1.config)(); //find.env file (at the root of the project), parses it, and injects the variables into process.env.
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
const client = (0, twilio_1.default)(accountSid, authToken);
class TwilioService {
    async sendOtp(phoneNumber, otp) {
        const message = await client.messages.create({
            body: `Your fortech OTP is: ${otp}`,
            from: twilioPhone,
            to: phoneNumber,
        });
        return message.sid; // You can store or log the message SID
    }
}
exports.TwilioService = TwilioService;
