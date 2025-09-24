"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const settings_controller_1 = require("../controllers/settings.controller");
const router = express_1.default.Router();
router.post('/banners', auth_middleware_1.authenticateJwt, auth_middleware_1.isAdmin, upload_middleware_1.upload.array('images', 5), settings_controller_1.addFeatureBanners);
router.get('/get-banners', auth_middleware_1.authenticateJwt, settings_controller_1.fetchFeatureBanners);
router.post('/update-feature-products', auth_middleware_1.authenticateJwt, auth_middleware_1.isAdmin, settings_controller_1.updateFeaturedProducts);
router.get('/fetch-feature-products', auth_middleware_1.authenticateJwt, settings_controller_1.getFeaturedProducts);
exports.default = router;
