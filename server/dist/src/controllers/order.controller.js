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
exports.getOrdersByUserId = exports.getAllOrdersForSeller = exports.updateOrderStatus = exports.getOrder = exports.createOrder = exports.paymentIntent = void 0;
const server_1 = require("../server");
const stripe = require('stripe')(process.env.PAYMENT_SECRET_KEY);
const paymentIntent = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { productIds, totalPrice } = req.body;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Unauthenticated user',
            });
            return;
        }
        const products = yield server_1.prisma.product.findMany({
            where: {
                id: {
                    in: productIds,
                },
            },
        });
        if (!products || products.length === 0) {
            res.status(400).send({ message: 'Products Not Found' });
            return;
        }
        const price = totalPrice * 100; // total price in cent (poysha)
        const { client_secret } = yield stripe.paymentIntents.create({
            amount: price,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
        });
        res.send({ clientSecret: client_secret });
    }
    catch (e) {
        console.log(e, 'payment faild');
        res.status(500).json({
            success: false,
            message: 'Unexpected error occured!',
        });
    }
});
exports.paymentIntent = paymentIntent;
const createOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { items, addressId, couponId, totalPrice, paymentId } = req.body;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        console.log(items, 'itemsitemsitems');
        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Unauthenticated user',
            });
            return;
        }
        //start our transaction
        const order = yield server_1.prisma.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
            //create new order
            const newOrder = yield prisma.order.create({
                data: {
                    userId,
                    addressId,
                    couponId,
                    totalPrice,
                    paymentMethod: 'CREDIT_CARD',
                    paymentStatus: 'COMPLETED',
                    paymentId,
                    items: {
                        create: items.map((item) => ({
                            productId: item.productId,
                            productName: item.productName,
                            productCategory: item.productCategory,
                            quantity: item.quantity,
                            size: item.size,
                            color: item.color,
                            price: item.price,
                            sellerId: item.sellerId,
                        })),
                    },
                },
                include: {
                    items: true,
                },
            });
            for (const item of items) {
                yield prisma.product.update({
                    where: { id: item.productId },
                    data: {
                        stock: { decrement: item.quantity },
                        soldCount: { increment: item.quantity },
                    },
                });
            }
            yield prisma.cartItem.deleteMany({
                where: {
                    cart: { userId },
                },
            });
            yield prisma.cart.delete({
                where: { userId },
            });
            if (couponId) {
                yield prisma.coupon.update({
                    where: { id: couponId },
                    data: { usageCount: { increment: 1 } },
                });
            }
            return newOrder;
        }));
        res.status(201).json(order);
    }
    catch (e) {
        console.log(e, 'createFinalOrder');
        res.status(500).json({
            success: false,
            message: 'Unexpected error occured!',
        });
    }
});
exports.createOrder = createOrder;
const getOrder = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { orderId } = req.params;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Unauthenticated user',
            });
            return;
        }
        const order = yield server_1.prisma.order.findFirst({
            where: {
                id: orderId,
                userId,
            },
            include: {
                items: true,
                address: true,
                coupon: true,
            },
        });
        res.status(200).json(order);
    }
    catch (e) {
        res.status(500).json({
            success: false,
            message: 'Unexpected error occured!',
        });
    }
});
exports.getOrder = getOrder;
const updateOrderStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { orderId } = req.params;
        const { status } = req.body;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Unauthenticated user',
            });
            return;
        }
        yield server_1.prisma.order.updateMany({
            where: {
                id: orderId,
            },
            data: {
                status,
            },
        });
        res.status(200).json({
            success: true,
            message: 'Order status updated successfully',
        });
    }
    catch (e) {
        res.status(500).json({
            success: false,
            message: 'Unexpected error occured!',
        });
    }
});
exports.updateOrderStatus = updateOrderStatus;
const getAllOrdersForSeller = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Unauthenticated user',
            });
            return;
        }
        const orders = yield server_1.prisma.order.findMany({
            where: {
                items: {
                    some: {
                        sellerId: userId,
                    },
                },
            },
            include: {
                items: true,
                address: true,
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        res.status(200).json(orders);
    }
    catch (e) {
        res.status(500).json({
            success: false,
            message: 'Unexpected error occurred!',
        });
    }
});
exports.getAllOrdersForSeller = getAllOrdersForSeller;
const getOrdersByUserId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            res.status(401).json({
                success: false,
                message: 'Unauthenticated user',
            });
            return;
        }
        const orders = yield server_1.prisma.order.findMany({
            where: {
                userId: userId,
            },
            include: {
                items: true,
                address: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        res.json(orders);
    }
    catch (e) {
        res.status(500).json({
            success: false,
            message: 'Unexpected error occured!',
        });
    }
});
exports.getOrdersByUserId = getOrdersByUserId;
