import pool from '../utils/database';
import { Marca, MarcaCreate, ListaPaginada } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class MarcaRepository {
  async findAll(page: number, limit: number): Promise<ListaPaginada<Marca>> {
    const offset = (page - 1) * limit;
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM marcas LIMIT ? OFFSET ?', [limit, offset]);
    const [totalRows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM marcas');
    const total = totalRows[0].count;
    return { data: rows as Marca[], paginacao: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }
  async findById(id: number): Promise<Marca | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM marcas WHERE id = ?', [id]);
    return rows.length ? (rows[0] as Marca) : null;
  }
  async create(data: MarcaCreate): Promise<Marca> {
    const [r] = await pool.query<ResultSetHeader>('INSERT INTO marcas (nome, pais_origem) VALUES (?, ?)', [data.nome, data.pais_origem]);
    return { id: r.insertId, ...data };
  }
  async update(id: number, data: MarcaCreate): Promise<void> {
    await pool.query('UPDATE marcas SET nome=?, pais_origem=? WHERE id=?', [data.nome, data.pais_origem, id]);
  }
  async countCarros(marcaId: number): Promise<number> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM carros WHERE marca_id=?', [marcaId]);
    return rows[0].count as number;
  }
  async delete(id: number): Promise<void> {
    await pool.query('DELETE FROM marcas WHERE id = ?', [id]);
  }
}
