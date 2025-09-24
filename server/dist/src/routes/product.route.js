"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const product_controller_1 = require("../controllers/product.controller");
const router = express_1.default.Router();
router.post('/create-new-product', auth_middleware_1.authenticateJwt, auth_middleware_1.isSeller, upload_middleware_1.upload.array('images', 5), product_controller_1.createProduct);
router.get('/fetch-seller-products', auth_middleware_1.authenticateJwt, product_controller_1.fetchAllProductsForSeller);
router.get('/fetch-admin-products', auth_middleware_1.authenticateJwt, auth_middleware_1.isAdmin, product_controller_1.fetchAllProductsForAdmin);
router.get('/fetch-client-products', auth_middleware_1.authenticateJwt, product_controller_1.getProductsForClient);
router.get('/:id', auth_middleware_1.authenticateJwt, product_controller_1.getProductByID);
router.put('/:id', auth_middleware_1.authenticateJwt, auth_middleware_1.isSeller, product_controller_1.updateProduct);
router.delete('/:id', auth_middleware_1.authenticateJwt, auth_middleware_1.isSeller, product_controller_1.deleteProduct);
exports.default = router;
