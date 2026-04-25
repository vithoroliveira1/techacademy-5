import request from 'supertest';
import app from '../server';
import pool from '../utils/database';
import jwt from 'jsonwebtoken';

jest.mock('../utils/database', () => ({ query: jest.fn() }));

const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET || 'secret');
const headers = { Authorization: `Bearer ${token}` };

describe('Carro Routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('POST /carros com marca_id inexistente -> 404 ou 400', async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce([[]]); // marca_repo find fail
    const res = await request(app).post('/carros').set(headers).send({modelo:'A', ano:2000, preco:10, cor:'X', marca_id:99});
    expect(res.status).toBe(400); // We coded 400 for Marca inexistente
  });
  it('DELETE /carros/:id com vendas vinculadas -> 400', async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce([[{id:1}]]); // find carro pass
    (pool.query as jest.Mock).mockResolvedValueOnce([[{count:1}]]); // have vendas
    const res = await request(app).delete('/carros/1').set(headers);
    expect(res.status).toBe(400);
  });
});
