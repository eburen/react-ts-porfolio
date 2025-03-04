import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';

interface DecodedToken {
  id: string;
  role: string;
}

// Extend Express Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  console.log('Auth middleware called', { 
    path: req.path, 
    method: req.method,
    hasAuthHeader: !!req.headers.authorization
  });
  
  try {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      console.log('Token extracted from Authorization header');
    }

    if (!token) {
      console.log('No token provided');
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    console.log('Token verified successfully', { userId: decoded.id, role: decoded.role });

    // Find user by id
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      console.log('User not found for token', { userId: decoded.id });
      return res.status(401).json({ message: 'Not authorized, user not found' });
    }

    console.log('User authenticated successfully', { 
      userId: user._id, 
      role: user.role,
      path: req.path
    });

    // Set user in request object
    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as admin' });
  }
}; 