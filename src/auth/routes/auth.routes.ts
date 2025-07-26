import { Router } from "express";
import express from "express";
import { UserController } from "../controller/user.controller";
import { UserService } from "../service/user.service";
import { catchAsync } from "../../utils/catchAsync";


const authRouter = express.Router();
const authService = new UserService();
const controller = new UserController(authService);

authRouter.post("/register", catchAsync(controller.register));
authRouter.post("/login", catchAsync(controller.login));
authRouter.get("/user/:id", catchAsync(controller.getUser));
export default authRouter;  