import { Response, Request } from 'express';
import { AuthService } from '../services/AuthService';
import { AuthRequest } from '../types';

export class AuthController {
  private service = new AuthService();
  private tratar(err: unknown, res: Response): Response {
    const msg = err instanceof Error ? err.message : 'Erro interno';
    if (['Email duplicado', 'Dados inválidos', 'Senha fraca', 'Campos faltando'].includes(msg)) return res.status(400).json({ error: msg });
    if (msg === 'Credenciais') return res.status(401).json({ error: msg });
    if (msg === 'Proibido') return res.status(403).json({ error: msg });
    if (msg === 'Não encontrado') return res.status(404).json({ error: msg });
    console.error('=== ERRO NO SERVIDOR ===', err);
    return res.status(500).json({ error: 'Erro interno', details: err instanceof Error ? err.message : String(err) });
  }
  registrar = async (req: Request, res: Response) => {
    try {
      const user = await this.service.registrar(req.body);
      res.status(201).json(user);
    } catch (e) { this.tratar(e, res); }
  };
  login = async (req: Request, res: Response) => {
    try {
      const token = await this.service.login(req.body);
      res.status(200).json({ token });
    } catch (e) { this.tratar(e, res); }
  };
  perfil = async (req: Request, res: Response) => {
    try {
      const id = (req as AuthRequest).usuarioId as number;
      const user = await this.service.getPerfil(id);
      res.status(200).json(user);
    } catch (e) { this.tratar(e, res); }
  };
  atualizar = async (req: Request, res: Response) => {
    try {
      const reqId = (req as AuthRequest).usuarioId as number;
      await this.service.atualizar(parseInt(req.params.id as string), reqId, req.body);
      res.status(200).json({ message: 'Atualizado' });
    } catch (e) { this.tratar(e, res); }
  };
}

