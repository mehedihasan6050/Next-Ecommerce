import { NextFunction, Request, Response } from 'express';
import { jwtVerify } from 'jose';
import { JwtPayload } from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export const authenticateJwt = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    res
      .status(401)
      .json({ success: false, error: 'Access token is not present' });
    return;
  }

  jwtVerify(accessToken, new TextEncoder().encode(process.env.JWT_SECRET))
    .then(res => {
      const payload = res.payload as JwtPayload & {
        userId: string;
        role: string;
        email: string;
      };

      req.user = {
        userId: payload.userId,
        role: payload.role,
        email: payload.email,
      };

      next();
    })
    .catch(e => {
      console.error(e);
      res
        .status(401)
        .json({ success: false, error: 'Access token is not present' });
    });
};

export const isSeller = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.role === 'SELLER') {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: 'Access denied! seller access required',
    });
  }
};

export const isAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({
      success: false,
      error: 'Access denied! Super admin access required',
    });
  }
};
