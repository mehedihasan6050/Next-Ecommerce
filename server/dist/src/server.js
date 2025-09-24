"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const product_route_1 = __importDefault(require("./routes/product.route"));
const coupon_route_1 = __importDefault(require("./routes/coupon.route"));
const settings_route_1 = __importDefault(require("./routes/settings.route"));
const cart_route_1 = __importDefault(require("./routes/cart.route"));
const address_route_1 = __importDefault(require("./routes/address.route"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const dashboard_route_1 = __importDefault(require("./routes/dashboard.route"));
//load all your enviroment variables
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
const corsOptions = {
    origin: process.env.CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
exports.prisma = new client_1.PrismaClient();
app.use('/api/auth', auth_route_1.default);
app.use('/api/products', product_route_1.default);
app.use('/api/coupon', coupon_route_1.default);
app.use('/api/settings', settings_route_1.default);
app.use('/api/cart', cart_route_1.default);
app.use('/api/address', address_route_1.default);
app.use('/api/order', order_route_1.default);
app.use('/api/dashboard', dashboard_route_1.default);
app.get('/', (req, res) => {
    res.send('Hello from E-Commerce backend');
});
app.listen(PORT, () => {
    console.log(`Server is now running on port ${PORT}`);
});
process.on('SIGINT', () => __awaiter(void 0, void 0, void 0, function* () {
    yield exports.prisma.$disconnect();
    process.exit();
}));
