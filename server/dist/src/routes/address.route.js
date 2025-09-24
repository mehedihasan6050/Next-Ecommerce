"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const address_controller_1 = require("../controllers/address.controller");
const router = express_1.default.Router();
router.use(auth_middleware_1.authenticateJwt);
router.post("/add-address", address_controller_1.createAddress);
router.get("/get-address", address_controller_1.getAddresses);
router.delete("/delete-address/:id", address_controller_1.deleteAddress);
router.put("/update-address/:id", address_controller_1.updateAddress);
exports.default = router;
