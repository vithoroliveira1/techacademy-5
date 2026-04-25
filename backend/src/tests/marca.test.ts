import request from 'supertest';
import app from '../server';
import pool from '../utils/database';
import jwt from 'jsonwebtoken';

jest.mock('../utils/database', () => ({ query: jest.fn() }));

const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET || 'secret');
const headers = { Authorization: `Bearer ${token}` };

describe('Marca Routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('GET /marcas sem token -> 401', async () => {
    const res = await request(app).get('/marcas');
    expect(res.status).toBe(401);
  });
  it('GET /marcas com token -> 200 com paginação', async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce([[{id:1}]]); // list
    (pool.query as jest.Mock).mockResolvedValueOnce([[{count:1}]]); // count
    const res = await request(app).get('/marcas').set(headers);
    expect(res.status).toBe(200);
    expect(res.body.paginacao).toBeDefined();
  });
  it('POST /marcas com dados válidos -> 201', async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce([{insertId:1}]);
    const res = await request(app).post('/marcas').set(headers).send({nome:'A', pais_origem:'B'});
    expect(res.status).toBe(201);
  });
  it('POST /marcas sem campos obrigatórios -> 400', async () => {
    const res = await request(app).post('/marcas').set(headers).send({nome:'A'});
    expect(res.status).toBe(400);
  });
  it('GET /marcas/:id existente -> 200', async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce([[{id:1}]]);
    const res = await request(app).get('/marcas/1').set(headers);
    expect(res.status).toBe(200);
  });
  it('GET /marcas/:id inexistente -> 404', async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce([[]]);
    const res = await request(app).get('/marcas/99').set(headers);
    expect(res.status).toBe(404);
  });
  it('PUT /marcas/:id existente -> 200', async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce([[{id:1}]]); // obter
    (pool.query as jest.Mock).mockResolvedValueOnce([]); // update
    const res = await request(app).put('/marcas/1').set(headers).send({nome:'A', pais_origem:'B'});
    expect(res.status).toBe(200);
  });
  it('PUT /marcas/:id inexistente -> 404', async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce([[]]); // obter fail
    const res = await request(app).put('/marcas/99').set(headers).send({nome:'A', pais_origem:'B'});
    expect(res.status).toBe(404);
  });
  it('DELETE /marcas/:id existente -> 200', async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce([[{id:1}]]); // obter pass
    (pool.query as jest.Mock).mockResolvedValueOnce([[{count:0}]]); // check fk
    (pool.query as jest.Mock).mockResolvedValueOnce([]); // delete
    const res = await request(app).delete('/marcas/1').set(headers);
    expect(res.status).toBe(200);
  });
  it('DELETE /marcas/:id inexistente -> 404', async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce([[]]);
    const res = await request(app).delete('/marcas/99').set(headers);
    expect(res.status).toBe(404);
  });
});
