import request from 'supertest';
import app from '../server';
import pool from '../utils/database';
import jwt from 'jsonwebtoken';
import { validarCPF } from '../utils/validacoes';

jest.mock('../utils/database', () => ({ query: jest.fn() }));
jest.mock('../utils/validacoes', () => ({
  validarCPF: jest.fn().mockReturnValue(true),
  validarEmail: jest.fn().mockReturnValue(true),
  validarSenhaForte: jest.fn().mockReturnValue(true),
  limparCPF: jest.fn().mockReturnValue('12312312312'),
  temTamanhoOuRepetido: jest.fn().mockReturnValue(false),
  calcularDigito: jest.fn().mockReturnValue(0)
}));

const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET || 'secret');
const headers = { Authorization: `Bearer ${token}` };

describe('Venda Routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('POST /vendas com CPF inválido -> 400', async () => {
    (validarCPF as jest.Mock).mockReturnValueOnce(false);
    const res = await request(app).post('/vendas').set(headers).send({carro_id: 1, comprador_nome: 'A', comprador_cpf: '000', valor_venda: 1, data_venda: '2023-01-01'});
    expect(res.status).toBe(400);
  });
  it('POST /vendas com carro_id inexistente -> 404 ou 400', async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce([[]]); // carro n econtrado
    const res = await request(app).post('/vendas').set(headers).send({carro_id: 99, comprador_nome: 'A', comprador_cpf: '12312312312', valor_venda: 1, data_venda: '2023-01-01'});
    expect(res.status).toBe(400); // Codado como 400
  });
});
