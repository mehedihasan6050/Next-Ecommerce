"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const cart_controller_1 = require("../controllers/cart.controller");
const router = express_1.default.Router();
router.get("/fetch-cart", auth_middleware_1.authenticateJwt, cart_controller_1.getCart);
router.post("/add-to-cart", auth_middleware_1.authenticateJwt, cart_controller_1.addToCart);
router.delete("/remove/:id", auth_middleware_1.authenticateJwt, cart_controller_1.removeFromCart);
router.put("/update/:id", auth_middleware_1.authenticateJwt, cart_controller_1.updateCartItemQuantity);
router.post("/clear-cart", auth_middleware_1.authenticateJwt, cart_controller_1.clearEntireCart);
exports.default = router;
