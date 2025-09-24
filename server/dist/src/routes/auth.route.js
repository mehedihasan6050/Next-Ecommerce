"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.post("/register", auth_controller_1.register);
router.post("/login", auth_controller_1.login);
router.post("/refresh-token", auth_controller_1.refreshAccessToken);
router.post("/logout", auth_controller_1.logout);
router.patch("/role-request", auth_middleware_1.authenticateJwt, auth_controller_1.handleRequest);
router.patch("/role-change/:id", auth_middleware_1.authenticateJwt, auth_middleware_1.isAdmin, auth_controller_1.handleRoleChange);
router.get("/fetch-request", auth_middleware_1.authenticateJwt, auth_middleware_1.isAdmin, auth_controller_1.fetchRequstForSeller);
exports.default = router;
