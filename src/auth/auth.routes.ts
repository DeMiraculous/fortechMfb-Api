import { Router } from "express";
import express from "express";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";


const authRouter =  express.Router();
const authService = new UserService();
const controller = new UserController(authService);

authRouter.post("/register", controller.register);
authRouter.post("/login", controller.login);
authRouter.get("/user", controller.getUser)
export default authRouter;  