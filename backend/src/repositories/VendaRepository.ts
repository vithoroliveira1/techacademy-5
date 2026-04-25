import pool from '../utils/database';
import { Venda, VendaCreate, ListaPaginada } from '../types';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export class VendaRepository {
  async findAll(page: number, limit: number): Promise<ListaPaginada<Venda>> {
    const offset = (page - 1) * limit;
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM vendas LIMIT ? OFFSET ?', [limit, offset]);
    const [totalRows] = await pool.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM vendas');
    const total = totalRows[0].count;
    return { data: rows as Venda[], paginacao: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }
  async findById(id: number): Promise<Venda | null> {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM vendas WHERE id = ?', [id]);
    return rows.length ? (rows[0] as Venda) : null;
  }
  async create(data: VendaCreate): Promise<Venda> {
    const [r] = await pool.query<ResultSetHeader>('INSERT INTO vendas (carro_id,comprador_nome,comprador_cpf,valor_venda,data_venda) VALUES (?,?,?,?,?)', [data.carro_id, data.comprador_nome, data.comprador_cpf, data.valor_venda, data.data_venda]);
    return { id: r.insertId, ...data };
  }
  async update(id: number, data: VendaCreate): Promise<void> {
    await pool.query('UPDATE vendas SET carro_id=?, comprador_nome=?, comprador_cpf=?, valor_venda=?, data_venda=? WHERE id=?', [data.carro_id, data.comprador_nome, data.comprador_cpf, data.valor_venda, data.data_venda, id]);
  }
  async delete(id: number): Promise<void> {
    await pool.query('DELETE FROM vendas WHERE id = ?', [id]);
  }
}
