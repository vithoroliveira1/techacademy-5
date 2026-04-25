import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload, AuthRequest } from '../types';

function extrairToken(header?: string): string {
  if (!header) throw new Error('Sem token');
  return header.split(' ')[1];
}

export const autenticacao = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = extrairToken(req.headers.authorization);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as JwtPayload;
    req.usuarioId = decoded.id;
    req.usuarioRole = decoded.role;
    next();
  } catch {
    res.status(401).json({ error: 'Token ausente ou inválido' });
  }
};
