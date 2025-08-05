import { plainToInstance } from "class-transformer";
import { RegisterDto } from "../dto/user.dto";
import { validate } from "class-validator";
import { Request, Response } from "express";
import { UserService } from "../service/user.service";
import { User } from "../../../generated/prisma";

export class UserController {
    constructor(
        private readonly userService: UserService
    ) { }
    /**
 * controller method for creating a user
 */
    register = async (req: Request, res: Response): Promise<any> => {
        const dto = plainToInstance(RegisterDto, req.body);
        const errors = await validate(dto);

        if (errors.length > 0) {
            return res.status(400).json({
                message: "Validation failed",
                errors: errors.map(err => ({
                    property: err.property,
                    constraints: err.constraints
                }))
            });
        }


        // Proceed with valid data
        const result = await this.userService.register(dto);
        return res.status(201).json(result);
    };
    /**
 * controller method for login
 */
    login = async (req: Request, res: Response) => {
        const result = await this.userService.login(req.body);
        res.status(200).json(result);
    }
    /**
* controller method for getting a particular user by id
*/
    getUser = async (req: Request, res: Response): Promise<any> => {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ error: 'Invalid user ID' });

        const user = await this.userService.getUserById(id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const { password, ...secureUser } = user;
        return res.json({ user: secureUser });
    };

    /**
     * update a user
     */
    updateUserById = async (req: Request, res: Response) => {
        try {
            const updated = await this.userService.updateUserById(req.params.id, req.body);
            res.json(updated);
        } catch (err) {
            res.status(500).json({ message: "Internal server error" });
        }
    }
    /**
 * Send Verification otp
 * @param phone_number
 * @returns
 */
    sendVerificationSMS = async (
        req: Request,
        res: Response
    ): Promise<void> => {
        const phone_number = req.params.phone;
        try {
            await this.userService.sendVerificationSMS(phone_number);
            res.status(200).json({ message: "OTP sent successfully" });
        } catch (error) {
            console.log(error)
        }
    };
    /**
* Send Verification otp
* @param phone_number
* @returns
*/
    verifyPhoneNumber = async (
        req: Request,
        res: Response
    ) => {
        const { phone_number } = req.params;
        const { activation_otp } = req.body;
        try {
            const result = await this.userService.verifyPhoneNumber({
                phone_number,
                activation_otp: activation_otp.toString(),
            });
            return res.json({ success: result });
        } catch (error: any) {
            console.error(error);
            return res
                .status(error.statusCode || 500)
                .json({ message: error.message || "Internal server error" });
        }
    }
}

