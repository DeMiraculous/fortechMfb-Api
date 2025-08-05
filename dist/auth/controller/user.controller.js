"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const class_transformer_1 = require("class-transformer");
const user_dto_1 = require("../dto/user.dto");
const class_validator_1 = require("class-validator");
class UserController {
    constructor(userService) {
        this.userService = userService;
        /**
     * controller method for creating a user
     */
        this.register = async (req, res) => {
            const dto = (0, class_transformer_1.plainToInstance)(user_dto_1.RegisterDto, req.body);
            const errors = await (0, class_validator_1.validate)(dto);
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
        this.login = async (req, res) => {
            const result = await this.userService.login(req.body);
            res.status(200).json(result);
        };
        /**
    * controller method for getting a particular user by id
    */
        this.getUser = async (req, res) => {
            const id = parseInt(req.params.id);
            if (isNaN(id))
                return res.status(400).json({ error: 'Invalid user ID' });
            const user = await this.userService.getUserById(id);
            if (!user)
                return res.status(404).json({ error: 'User not found' });
            const { password, ...secureUser } = user;
            return res.json({ user: secureUser });
        };
        /**
         * update a user
         */
        this.updateUserById = async (req, res) => {
            try {
                const updated = await this.userService.updateUserById(req.params.id, req.body);
                res.json(updated);
            }
            catch (err) {
                res.status(500).json({ message: "Internal server error" });
            }
        };
        /**
     * Send Verification otp
     * @param phone_number
     * @returns
     */
        this.sendVerificationSMS = async (req, res) => {
            const phone_number = req.params.phone;
            try {
                await this.userService.sendVerificationSMS(phone_number);
                res.status(200).json({ message: "OTP sent successfully" });
            }
            catch (error) {
                console.log(error);
            }
        };
        /**
    * Send Verification otp
    * @param phone_number
    * @returns
    */
        this.verifyPhoneNumber = async (req, res) => {
            const { phone_number } = req.params;
            const { activation_otp } = req.body;
            try {
                const result = await this.userService.verifyPhoneNumber({
                    phone_number,
                    activation_otp: activation_otp.toString(),
                });
                return res.json({ success: result });
            }
            catch (error) {
                console.error(error);
                return res
                    .status(error.statusCode || 500)
                    .json({ message: error.message || "Internal server error" });
            }
        };
    }
}
exports.UserController = UserController;
