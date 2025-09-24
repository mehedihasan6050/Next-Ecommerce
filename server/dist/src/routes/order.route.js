"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const order_controller_1 = require("../controllers/order.controller");
const router = express_1.default.Router();
router.use(auth_middleware_1.authenticateJwt);
router.post('/create-order', order_controller_1.createOrder);
router.post('/create-payment-intent', order_controller_1.paymentIntent);
router.get('/get-single-order/:orderId', order_controller_1.getOrder);
router.get('/get-order-by-user-id', order_controller_1.getOrdersByUserId);
router.get('/get-all-orders-for-seller', auth_middleware_1.isSeller, order_controller_1.getAllOrdersForSeller);
router.put('/:orderId/status', auth_middleware_1.isSeller, order_controller_1.updateOrderStatus);
exports.default = router;
