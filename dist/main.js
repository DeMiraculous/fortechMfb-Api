"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const client_1 = require("@prisma/client");
const auth_routes_1 = __importDefault(require("./auth/routes/auth.routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
// Initialize environment variables
dotenv_1.default.config();
// Initialize Express app
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
// Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.json()); // Parse JSON body
app.use((0, morgan_1.default)("dev")); // Log requests
// Health check
app.get("/", (req, res) => {
    res.json({ message: "API is running 🚀" });
});
// Routes
app.use("/api/auth", auth_routes_1.default);
// app.use("/api/kyc", kycRoutes);
// Global error handler
app.use(error_middleware_1.errorHandler);
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server running on port: ${PORT}`);
});
