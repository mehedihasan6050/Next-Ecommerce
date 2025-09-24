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
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardStatsForAdmin = exports.dashboardStatics = void 0;
const server_1 = require("../server");
const dashboardStatics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log('🔥 API reached, user:', req.user); // প্রথমেই log করো
    try {
        // logic here
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            res.status(401).json({ message: 'unthorized request' });
            return;
        }
        // Fetch all DELIVERED orders
        const deliveredOrders = yield server_1.prisma.order.findMany({
            where: {
                items: {
                    some: { sellerId: userId },
                },
                status: 'DELIVERED',
            },
            select: {
                userId: true,
                totalPrice: true,
            },
        });
        // Total Sales (sum of totalPrice)
        const totalSales = deliveredOrders.reduce((sum, order) => sum + order.totalPrice, 0);
        // Unique Customers
        const totalCustomers = new Set(deliveredOrders.map(o => o.userId)).size;
        // Total Orders (DELIVERED + PENDING)
        const totalOrders = yield server_1.prisma.order.count({
            where: {
                items: {
                    some: { sellerId: userId },
                },
            },
        });
        // Pending Orders
        const pendingOrders = yield server_1.prisma.order.count({
            where: {
                items: {
                    some: { sellerId: userId },
                },
                status: 'PENDING',
            },
        });
        console.log({
            totalSales,
            totalCustomers,
            totalOrders,
            pendingOrders,
        });
        res.status(200).json({
            totalSales,
            totalCustomers,
            totalOrders,
            pendingOrders,
        });
    }
    catch (error) {
        res.status(400).json({ error, message: 'something went wrong' });
    }
});
exports.dashboardStatics = dashboardStatics;
const dashboardStatsForAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    console.log('🔥 Admin API reached, user:', req.user);
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId || ((_b = req.user) === null || _b === void 0 ? void 0 : _b.role) !== 'ADMIN') {
            res.status(401).json({ message: 'Unauthorized request' });
            return;
        }
        // Total Orders (all orders)
        const totalOrders = yield server_1.prisma.order.count();
        // Completed Orders (all DELIVERED orders)
        const completedOrders = yield server_1.prisma.order.count({
            where: { status: 'DELIVERED' },
        });
        // Total Sales (sum of totalPrice of all DELIVERED orders)
        const deliveredOrders = yield server_1.prisma.order.findMany({
            where: { status: 'DELIVERED' },
            select: { totalPrice: true },
        });
        const totalSales = deliveredOrders.reduce((sum, order) => sum + order.totalPrice, 0);
        // Total Customers (exclude sellers & admins)
        const totalCustomers = yield server_1.prisma.user.count({
            where: {
                role: 'USER', // assuming role is 'CUSTOMER' for normal users
            },
        });
        console.log({
            totalOrders,
            completedOrders,
            totalSales,
            totalCustomers,
        });
        res.status(200).json({
            totalOrders,
            completedOrders,
            totalSales,
            totalCustomers,
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).json({ error, message: 'Something went wrong' });
    }
});
exports.dashboardStatsForAdmin = dashboardStatsForAdmin;
