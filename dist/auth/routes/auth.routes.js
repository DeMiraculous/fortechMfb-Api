"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controller/user.controller");
const user_service_1 = require("../service/user.service");
const catchAsync_1 = require("../../utils/catchAsync");
const authRouter = express_1.default.Router();
const authService = new user_service_1.UserService();
const controller = new user_controller_1.UserController(authService);
authRouter.post("/register", (0, catchAsync_1.catchAsync)(controller.register));
authRouter.post("/login", (0, catchAsync_1.catchAsync)(controller.login));
authRouter.get("/user/:id", (0, catchAsync_1.catchAsync)(controller.getUser));
authRouter.patch("/user:id", (0, catchAsync_1.catchAsync)(controller.updateUserById));
authRouter.post("/user:phone_number", (0, catchAsync_1.catchAsync)(controller.sendVerificationSMS));
exports.default = authRouter;
