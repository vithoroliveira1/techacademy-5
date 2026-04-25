import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UsuarioRepository } from '../repositories/UsuarioRepository';
import { UsuarioCreate, UsuarioLogin, UsuarioResponse, UsuarioUpdate } from '../types';
import { validarCPF, validarEmail, validarSenhaForte } from '../utils/validacoes';

export class AuthService {
  private repo = new UsuarioRepository();
  async registrar(data: UsuarioCreate): Promise<UsuarioResponse> {
    this.validarCriacao(data);
    await this.verificarEmailExistente(data.email);
    data.senha = await bcrypt.hash(data.senha, 10);
    return this.repo.create(data);
  }
  private validarCriacao(data: UsuarioCreate): void {
    if (!data.nome || !data.email || !data.senha || !data.cpf) throw new Error('Campos faltando');
    if (!validarEmail(data.email) || !validarCPF(data.cpf)) throw new Error('Dados inválidos');
    if (!validarSenhaForte(data.senha)) throw new Error('Senha fraca');
  }
  private async verificarEmailExistente(email: string): Promise<void> {
    const user = await this.repo.findByEmail(email);
    if (user) throw new Error('Email duplicado');
  }
  async login(data: UsuarioLogin): Promise<string> {
    const user = await this.repo.findByEmail(data.email);
    if (!user) throw new Error('Credenciais');
    const valida = await bcrypt.compare(data.senha, user.senha);
    if (!valida) throw new Error('Credenciais');
    return jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '8h' });
  }
  async getPerfil(id: number): Promise<UsuarioResponse> {
    const user = await this.repo.findById(id);
    if (!user) throw new Error('Não encontrado');
    return user;
  }
  async atualizar(id: number, reqId: number, data: UsuarioUpdate): Promise<void> {
    if (id !== reqId) throw new Error('Proibido');
    if (!validarCPF(data.cpf) || !data.nome) throw new Error('Dados inválidos');
    if (data.senha && !validarSenhaForte(data.senha)) throw new Error('Senha fraca');
    const user = await this.repo.findById(id);
    if (!user) throw new Error('Não encontrado');
    if (data.senha) {
      data.senha = await bcrypt.hash(data.senha, 10);
    }
    await this.repo.update(id, data);
  }
}
