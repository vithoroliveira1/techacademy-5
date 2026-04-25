import { Request, Response } from 'express';
import { AuthRequest } from '../types';
import { AluguelService } from '../services/AluguelService';

export class AluguelController {
  private service = new AluguelService();
  private tratar(err: unknown, res: Response): Response {
    const msg = err instanceof Error ? err.message : 'Erro interno';
    if (['Campos faltando', 'Carro inexistente', 'Carro não está disponível', 'Data de fim deve ser posterior a data de início', 'Aluguel já está finalizado ou cancelado'].includes(msg)) return res.status(400).json({ error: msg });
    if (msg === 'Não encontrado') return res.status(404).json({ error: msg });
    return res.status(500).json({ error: 'Erro interno' });
  }

  listar = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      res.status(200).json(await this.service.listar(page, limit));
    } catch (e) { this.tratar(e, res); }
  };

  listarMeus = async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const usuarioId = (req as AuthRequest).usuarioId as number;
      res.status(200).json(await this.service.listarMeus(usuarioId, page, limit));
    } catch (e) { this.tratar(e, res); }
  };

  obter = async (req: Request, res: Response) => {
    try {
      res.status(200).json(await this.service.obter(parseInt(req.params.id as string)));
    } catch (e) { this.tratar(e, res); }
  };

  criar = async (req: Request, res: Response) => {
    try {
      const usuarioId = (req as AuthRequest).usuarioId as number;
      res.status(201).json(await this.service.criar(usuarioId, req.body));
    } catch (e) { this.tratar(e, res); }
  };

  finalizar = async (req: Request, res: Response) => {
    try {
      await this.service.finalizar(parseInt(req.params.id as string));
      res.status(200).json({ message: 'Finalizado' });
    } catch (e) { this.tratar(e, res); }
  };

  deletar = async (req: Request, res: Response) => {
    try {
      await this.service.deletar(parseInt(req.params.id as string));
      res.status(200).json({ message: 'Deletado' });
    } catch (e) { this.tratar(e, res); }
  };
}

