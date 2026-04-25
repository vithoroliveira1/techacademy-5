import request from 'supertest';
import app from '../server';
import pool from '../utils/database';
import { validarCPF, validarEmail, validarSenhaForte } from '../utils/validacoes';
import bcrypt from 'bcryptjs';

jest.mock('../utils/database', () => ({ query: jest.fn() }));
jest.mock('../utils/validacoes', () => ({
  validarCPF: jest.fn().mockReturnValue(true),
  validarEmail: jest.fn().mockReturnValue(true),
  validarSenhaForte: jest.fn().mockReturnValue(true),
  limparCPF: jest.fn().mockReturnValue('12312312312'),
  temTamanhoOuRepetido: jest.fn().mockReturnValue(false),
  calcularDigito: jest.fn().mockReturnValue(0)
}));
jest.mock('bcryptjs', () => ({ hash: jest.fn().mockResolvedValue('hashed'), compare: jest.fn().mockResolvedValue(true) }));

describe('Auth Routes', () => {
  beforeEach(() => jest.clearAllMocks());

  it('POST /auth/registrar com dados válidos -> 201', async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce([[]]); // Email não existe
    (pool.query as jest.Mock).mockResolvedValueOnce([{ insertId: 1 }]); // Create
    const res = await request(app).post('/auth/registrar').send({ nome: 'N', email: 'e@e.com', senha: 'S', cpf: '1' });
    expect(res.status).toBe(201);
  });
  it('POST /auth/registrar com email duplicado -> 400', async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce([[{ id: 1 }]]);
    const res = await request(app).post('/auth/registrar').send({ nome: 'N', email: 'e@e.com', senha: 'S', cpf: '1' });
    expect(res.status).toBe(400);
  });
  it('POST /auth/registrar com CPF inválido -> 400', async () => {
    (validarCPF as jest.Mock).mockReturnValueOnce(false);
    const res = await request(app).post('/auth/registrar').send({ nome: 'N', email: 'e@e.com', senha: 'S', cpf: '1' });
    expect(res.status).toBe(400);
  });
  it('POST /auth/registrar com senha fraca -> 400', async () => {
    (validarSenhaForte as jest.Mock).mockReturnValueOnce(false);
    const res = await request(app).post('/auth/registrar').send({ nome: 'N', email: 'e@e.com', senha: 'S', cpf: '1' });
    expect(res.status).toBe(400);
  });
  it('POST /auth/registrar com campos faltando -> 400', async () => {
    const res = await request(app).post('/auth/registrar').send({ nome: 'N' });
    expect(res.status).toBe(400);
  });
  it('POST /auth/login com credenciais válidas -> 200 com token', async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce([[{ id: 1, senha: 'hashed' }]]);
    const res = await request(app).post('/auth/login').send({ email: 'e@e.com', senha: 'S' });
    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });
  it('POST /auth/login com senha errada -> 401', async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce([[{ id: 1, senha: 'hashed' }]]);
    (bcrypt.compare as jest.Mock).mockResolvedValueOnce(false);
    const res = await request(app).post('/auth/login').send({ email: 'e@e.com', senha: 'S' });
    expect(res.status).toBe(401);
  });
  it('POST /auth/login com email inexistente -> 401', async () => {
    (pool.query as jest.Mock).mockResolvedValueOnce([[]]);
    const res = await request(app).post('/auth/login').send({ email: 'e@e.com', senha: 'S' });
    expect(res.status).toBe(401);
  });
  it('GET /auth/perfil sem token -> 401', async () => {
    const res = await request(app).get('/auth/perfil');
    expect(res.status).toBe(401);
  });
  // Testing with fake token requires signing one
  it('GET /auth/perfil com token válido -> 200', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET || 'secret');
    (pool.query as jest.Mock).mockResolvedValueOnce([[{ id: 1 }]]); // find user
    const res = await request(app).get('/auth/perfil').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
  it('PUT /auth/perfil/:id de outro usuário -> 403', async () => {
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: 1 }, process.env.JWT_SECRET || 'secret');
    const res = await request(app).put('/auth/perfil/2').set('Authorization', `Bearer ${token}`).send({nome:'M', senha:'S', cpf:'1'});
    expect(res.status).toBe(403);
  });
});
