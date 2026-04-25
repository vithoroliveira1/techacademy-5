import pool from '../utils/database';
import { Usuario, UsuarioCreate, UsuarioUpdate, UsuarioResponse } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

function toResponse(u: Usuario): UsuarioResponse {
  return { id: u.id, nome: u.nome, email: u.email, cpf: u.cpf, role: u.role };
}

export class UsuarioRepository {
  async findByEmail(email: string): Promise<Usuario | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM usuarios WHERE email = ?', [email]
    );
    return rows.length ? (rows[0] as Usuario) : null;
  }

  async findById(id: number): Promise<UsuarioResponse | null> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT id, nome, email, cpf, role FROM usuarios WHERE id = ?', [id]
    );
    return rows.length ? (rows[0] as UsuarioResponse) : null;
  }

  async create(u: UsuarioCreate): Promise<UsuarioResponse> {
    const role = u.role ?? 'lead';
    const [r] = await pool.query<ResultSetHeader>(
      'INSERT INTO usuarios (nome, email, senha, cpf, role) VALUES (?, ?, ?, ?, ?)',
      [u.nome, u.email, u.senha, u.cpf, role]
    );
    return { id: r.insertId, nome: u.nome, email: u.email, cpf: u.cpf, role };
  }

  async update(id: number, u: UsuarioUpdate): Promise<void> {
    if (u.senha) {
      await pool.query(
        'UPDATE usuarios SET nome = ?, senha = ?, cpf = ? WHERE id = ?',
        [u.nome, u.senha, u.cpf, id]
      );
    } else {
      await pool.query(
        'UPDATE usuarios SET nome = ?, cpf = ? WHERE id = ?',
        [u.nome, u.cpf, id]
      );
    }
  }
}
