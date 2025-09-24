"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dashboard_controller_1 = require("../controllers/dashboard.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
router.use(auth_middleware_1.authenticateJwt);
router.get('/statistics-seller', auth_middleware_1.isSeller, dashboard_controller_1.dashboardStatics);
router.get('/statistics-admin', auth_middleware_1.isAdmin, dashboard_controller_1.dashboardStatsForAdmin);
exports.default = router;
