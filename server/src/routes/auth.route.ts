import express from "express";
import {
  fetchRequstForSeller,
  handleRequest,
  handleRoleChange,
  login,
  logout,
  refreshAccessToken,
  register,
} from "../controllers/auth.controller";
import { authenticateJwt, isAdmin } from "../middlewares/auth.middleware";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh-token", refreshAccessToken);
router.post("/logout", logout);
router.patch("/role-request",authenticateJwt, handleRequest);
router.patch("/role-change/:id", authenticateJwt, isAdmin, handleRoleChange);
router.get("/fetch-request",authenticateJwt, isAdmin, fetchRequstForSeller);

export default router;