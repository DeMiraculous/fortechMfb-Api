import prisma from "../../prisma/prisma.client";
import * as bcrypt from "bcrypt";
import { LoginUserDto, RegisterDto } from "../dto/user.dto";
import jwt from "jsonwebtoken";
import { account, User } from "../../../generated/prisma";
import { JWT_SECRET } from "../../config/env";
import { TwilioService } from "../../third-party services/twillio.service";
import { CreateaccountDto } from "../../account/dto/account.dto";


export class UserService {

    private twilioService = new TwilioService()
    /**
 * service method for creating a user
 */
    async register(data: RegisterDto) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await prisma.user.create({
            data: { ...data, password: hashedPassword }
        });
        const { password, ...secureUser } = user; //will help remove the hash password before returning user

        return {
            message: "successfully Registered",
            user: secureUser
        };
    }
    /**
 * service method for login a user
 * @param LoginUserDto
 */
    async login(data: LoginUserDto) {
        const user = await prisma.user.findUnique({ where: { email: data.email } });
        if (!user) throw new Error("Invalid credentials");

        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch) throw new Error("Invalid credentials");

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        return { message: "Login successful", token };
    }
    /**
     * for getting a particular user
     * @param id 
     * @returns 
     */
    async getUserById(id: number): Promise<User> {
        return await prisma.user.findUnique({
            where: { id },
        });
    };
    /**
 * for updating a particular user
 * @param id 
 * @returns 
 */
    async updateUserById(id: string, data: Partial<{ full_name: string; email: string; }>) {
        return prisma.user.update({
            where: { id },
            data,
        });
    }
    /**
* for sending verification sms to a particular user
* @param id 
* @returns 
*/
    async sendVerificationSMS(phone_number: string): Promise<void> {
        const user = await this.findUserWithPhoneNumber(phone_number);

        if (!user) {
            throw new Error("User not found");
        }

        if (user.phone_verified) {
            throw new Error("Your phone number is already verified");
        }

        const activation_otp = Math.floor(1000 + Math.random() * 9000).toString(); // generate 4-digit OTP

        await this.updateUserActivationOTP(phone_number, activation_otp);

        const message = `Your verification code is ${activation_otp}. Valid for 10 minutes, one-time use only.`;

        try {
            const smsResponse = await this.twilioService.sendOtp(phone_number, activation_otp);
            console.log("SMS sent successfully. SID:", smsResponse);
        } catch (error) {
            console.error("Failed to send SMS", error);
        }
    }
    /**
 * for getting a particular user
 * @param phone_number 
 * @returns 
 */
    private async findUserWithPhoneNumber(phone_number: string): Promise<User> {
        return await prisma.user.findUnique({
            where: {
                phone_number
            }
        });
    }
    /**
 * for getting a particular user
 * @param id 
 * @returns 
 */
    private async updateUserActivationOTP(
        phone_number: string,
        activation_otp: string
    ): Promise<User> {
        return await prisma.user.update({
            where: { phone_number },
            data: { activation_otp },
        })
    }
    /**
     * end point for verifying phone number
     * @param phone_number
     * @param activation_otp
     * @returns 
     */
    verifyPhoneNumber = async ({
        phone_number,
        activation_otp
    }: {
        phone_number: string;
        activation_otp: string;
    }): Promise<boolean> => {
        const user = await this.findUserWithPhoneNumber(phone_number);

        if (!user) {
            throw new Error("User not found");
        }

        if (user.phone_verified) {
            const error = new Error("Phone number already verified");
            (error as any).statusCode = 401;
            throw error;

        }

        //Expiry logic
        const currentTime = new Date();
        const activationTime = new Date(user.updated_at);
        const timeDifference = currentTime.getTime() - activationTime.getTime();
        const expirationTime = 3 * 60 * 1000; // 3 mins
        if (timeDifference > expirationTime) {
            const error = new Error("Activation pin has expired");
            (error as any).statusCode = 401;
            throw error;
        }

        if (user.activation_otp !== activation_otp.toString()) {
            const error = new Error("Invalid activation otp");
            (error as any).statusCode = 401;
            throw error;
        }

        const generatedAccountNumber = await this.generateAccountNumber();

        const account = await this.createAccount({
            user_id: user.id,
            account_number: generatedAccountNumber,
            balance: 0,
        });

        await this.updateUserPhoneNoVerificationStatus(
            user.id,
            true,
            account.account_number
        );

        return true;
    };
    /**
     * helper method for generating Acct number
     * @returns 
     */
    private async generateAccountNumber(): Promise<string> {
        const accountNumber = Math.floor(
            1000000000 + Math.random() * 9000000000
        ).toString();

        return await this.isAccountNumberUnique(accountNumber)
            ? accountNumber
            : this.generateAccountNumber();
    }
        /**
     * helper method for if acct number is unique
     * @param accountNumber
     * @returns 
     */
    async isAccountNumberUnique(accountNumber: string): Promise<boolean> {
        const existingAccount = await prisma.account.findUnique({
            where: { account_number: accountNumber },
        });
        return !existingAccount;
    }
    async createAccount(createaccountDto: CreateaccountDto): Promise<account> {
        return await prisma.account.create({
            data: {
                account_number: createaccountDto.account_number,
                balance: 0,
                account_type: "SAVINGS",
                user: {
                    connect: {
                        id: createaccountDto.user_id,
                    },
                },
            },
        });
    }
    /**
 *
 * @param userId
 * @param numberVerified
 * @param account_number
 * @returns
 */
    async updateUserPhoneNoVerificationStatus(
        userId: number,
        numberVerified: boolean,
        account_number: string
    ): Promise<User> {
        return prisma.user.update({
            where: { id: userId },
            data: {
                phone_verified: numberVerified,
                signup_otp: null,
                account_number,
            },
        });
    }
}

