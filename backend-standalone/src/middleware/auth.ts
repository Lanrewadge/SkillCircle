import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { createError } from './errorHandler';

const prisma = new PrismaClient();

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw createError(401, 'No token provided');
    }

    const token = authHeader.substring(7);

    if (!process.env.JWT_SECRET) {
      throw createError(500, 'JWT secret not configured');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET) as any;

    // Verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, isTeacher: true, verified: true }
    });

    if (!user) {
      throw createError(401, 'User not found');
    }

    if (!user.verified) {
      throw createError(401, 'Account not verified');
    }

    req.user = {
      id: user.id,
      email: user.email,
      role: user.isTeacher ? 'teacher' : 'student'
    };

    next();
  } catch (error) {
    next(error);
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createError(401, 'Authentication required'));
    }

    if (!roles.includes(req.user.role)) {
      return next(createError(403, 'Insufficient permissions'));
    }

    next();
  };
};