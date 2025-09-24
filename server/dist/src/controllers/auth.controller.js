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
exports.fetchRequstForSeller = exports.handleRoleChange = exports.handleRequest = exports.logout = exports.refreshAccessToken = exports.login = exports.register = void 0;
const server_1 = require("../server");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const uuid_1 = require("uuid");
function generateToken(userId, email, role) {
    const accessToken = jsonwebtoken_1.default.sign({
        userId,
        email,
        role,
    }, process.env.JWT_SECRET, { expiresIn: '60m' });
    const refreshToken = (0, uuid_1.v4)();
    return { accessToken, refreshToken };
}
function setTokens(res, accessToken, refreshToken) {
    return __awaiter(this, void 0, void 0, function* () {
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 1000,
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60,
        });
    });
}
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const existingUser = yield server_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({
                success: false,
                error: 'User with this email exists!',
            });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        const user = yield server_1.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'USER',
            },
        });
        res.status(201).json({
            message: 'User registered successfully',
            success: true,
            userId: user.id,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed' });
    }
});
exports.register = register;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        console.log(email, password);
        const extractCurrentUser = yield server_1.prisma.user.findUnique({
            where: { email },
        });
        if (!extractCurrentUser ||
            !(yield bcryptjs_1.default.compare(password, extractCurrentUser.password))) {
            res.status(401).json({
                success: false,
                error: 'Invalied credentials',
            });
            return;
        }
        //create our access and refreshtoken
        const { accessToken, refreshToken } = generateToken(extractCurrentUser.id, extractCurrentUser.email, extractCurrentUser.role);
        //set out tokens
        yield setTokens(res, accessToken, refreshToken);
        res.status(200).json({
            success: true,
            message: 'Login successfully',
            user: {
                id: extractCurrentUser.id,
                name: extractCurrentUser.name,
                email: extractCurrentUser.email,
                role: extractCurrentUser.role,
                roleRequest: extractCurrentUser.roleRequest
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Login failed' });
    }
});
exports.login = login;
const refreshAccessToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.status(401).json({
            success: false,
            error: 'Invalid refresh token',
        });
    }
    try {
        const user = yield server_1.prisma.user.findFirst({
            where: {
                refreshToken: refreshToken,
            },
        });
        if (!user) {
            res.status(401).json({
                success: false,
                error: 'User not found',
            });
            return;
        }
        const { accessToken, refreshToken: newRefreshToken } = generateToken(user.id, user.email, user.role);
        //set out tokens
        yield setTokens(res, accessToken, newRefreshToken);
        res.status(200).json({
            success: true,
            message: 'Refresh token refreshed successfully',
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Refresh token error' });
    }
});
exports.refreshAccessToken = refreshAccessToken;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.json({
        success: true,
        message: 'User logged out successfully',
    });
});
exports.logout = logout;
const handleRequest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            res.status(401).json({ message: 'Unauthorized request' });
            return;
        }
        yield server_1.prisma.user.update({
            where: { id: userId },
            data: { roleRequest: true },
        });
        res.status(200).json({ success: true, message: 'request successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to requested as a seller",
        });
    }
});
exports.handleRequest = handleRequest;
const handleRoleChange = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(401).json({ message: 'id not found' });
            return;
        }
        yield server_1.prisma.user.update({
            where: { id: id },
            data: { role: 'SELLER', roleRequest: false },
        });
        res.status(200).json({ success: true, message: 'request successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Failed to update role",
        });
    }
});
exports.handleRoleChange = handleRoleChange;
const fetchRequstForSeller = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requestedUser = yield server_1.prisma.user.findMany({
            where: { roleRequest: true },
            select: {
                id: true,
                email: true,
                roleRequest: true,
                name: true,
                role: true
            }
        });
        res.status(200).json(requestedUser);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({
            success: false,
            message: "Failed to fetch requested user",
        });
    }
});
exports.fetchRequstForSeller = fetchRequstForSeller;
