// src/middleware/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Adicionamos uma propriedade 'user' ao tipo Request do Express
declare global {
  namespace Express {
    interface Request {
      user?: { userId: string };
    }
  }
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    
    // Anexa o payload do token (que contém o userId) à requisição
    req.user = user; 
    
    next();
  });
};