import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthUser } from '../../application/services/AuthService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

declare global {
   namespace Express {
      interface Request {
         user?: AuthUser;
      }
   }
}

export function authenticate(req: Request, res: Response, next: NextFunction): void {
   const header = req.headers.authorization;
   if (!header || !header.startsWith('Bearer ')) {
      res.status(401).json({ ok: false, message: 'Token requerido' });
      return;
   }

   const token = header.slice(7);
   try {
      const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
      req.user = decoded;
      next();
   } catch {
      res.status(401).json({ ok: false, message: 'Token inválido o expirado' });
   }
}

export function authorize(...roles: string[]) {
   return (req: Request, res: Response, next: NextFunction): void => {
      if (!req.user) {
         res.status(401).json({ ok: false, message: 'No autenticado' });
         return;
      }
      if (!roles.includes(req.user.rol)) {
         res.status(403).json({ ok: false, message: `Acción no permitida para rol ${req.user.rol}` });
         return;
      }
      next();
   };
}
