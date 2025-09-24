"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const coupon_controller_1 = require("../controllers/coupon.controller");
const router = express_1.default.Router();
router.use(auth_middleware_1.authenticateJwt);
router.get('/fetch-all-coupons', coupon_controller_1.fetchAllCoupons);
router.get('/fetch-all-coupons-seller', auth_middleware_1.isSeller, coupon_controller_1.fetchAllCouponSeller);
router.post('/create-coupon', auth_middleware_1.isSeller, coupon_controller_1.createCoupon);
router.delete('/:id', auth_middleware_1.isSeller, coupon_controller_1.deleteCoupon);
exports.default = router;
