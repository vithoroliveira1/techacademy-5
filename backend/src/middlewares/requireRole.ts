import { Response, NextFunction } from 'express';
import { Role, AuthRequest } from '../types';

export function requireRole(...roles: Role[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const role = req.usuarioRole;
    if (!role || !roles.includes(role)) {
      res.status(403).json({ error: 'Acesso negado: permissão insuficiente' });
      return;
    }
    next();
  };
}
