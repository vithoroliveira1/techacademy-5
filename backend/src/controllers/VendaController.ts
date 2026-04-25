import { Request, Response } from 'express';
import { VendaService } from '../services/VendaService';

export class VendaController {
  private service = new VendaService();
  private tratar(err: unknown, res: Response): Response {
    const msg = err instanceof Error ? err.message : 'Erro interno';
    if (['Campos faltando', 'CPF inválido', 'Carro inexistente'].includes(msg)) return res.status(400).json({ error: msg });
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
  obter = async (req: Request, res: Response) => {
    try {
      res.status(200).json(await this.service.obter(parseInt(req.params.id as string)));
    } catch (e) { this.tratar(e, res); }
  };
  criar = async (req: Request, res: Response) => {
    try {
      res.status(201).json(await this.service.criar(req.body));
    } catch (e) { this.tratar(e, res); }
  };
  atualizar = async (req: Request, res: Response) => {
    try {
      await this.service.atualizar(parseInt(req.params.id as string), req.body);
      res.status(200).json({ message: 'Atualizado' });
    } catch (e) { this.tratar(e, res); }
  };
  deletar = async (req: Request, res: Response) => {
    try {
      await this.service.deletar(parseInt(req.params.id as string));
      res.status(200).json({ message: 'Deletado' });
    } catch (e) { this.tratar(e, res); }
  };
}

