import prisma from "../../prisma/prisma.client";
import * as bcrypt from "bcrypt";
import { LoginUserDto, RegisterDto } from "../dto/user.dto";
import jwt from "jsonwebtoken";
import { User } from "../../../generated/prisma";
import { JWT_SECRET } from "../../config/env";

export class UserService {
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
}