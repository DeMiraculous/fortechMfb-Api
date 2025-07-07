import prisma from "../prisma/prisma.client";
import * as bcrypt from "bcrypt";
import { LoginUserDto, RegisterDto } from "./auth.dto";
import jwt from "jsonwebtoken";
import { User } from "../../generated/prisma";

export class UserService {
    async register(data: RegisterDto) {
        const hashedPassword = await bcrypt.hash(data.password, 10);
        /**
         * service method for creating a user
         */
        const user = await prisma.user.create({
            data: { ...data, password: hashedPassword }
        });

        return { message: "Registered", user };
    }
    /**
 * service method for creating a user
 * @param LoginUserDto
 */
    async login(data: LoginUserDto) {
        const user = await prisma.user.findUnique({ where: { email: data.email } });
        if (!user) throw new Error("Invalid credentials");

        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch) throw new Error("Invalid credentials");

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET!,
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