import React from 'react';
import './common.css';

interface Props<T> {
  headers: string[];
  data: T[];
  renderRow: (item: T, index: number) => React.ReactNode;
}

export function Table<T>({ headers, data, renderRow }: Props<T>) {
  return (
    <div className="table-wrapper">
      <table className="custom-table">
        <thead>
          <tr>{headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr><td colSpan={headers.length} className="table-empty">Nenhum registro</td></tr>
          ) : data.map(renderRow)}
        </tbody>
      </table>
    </div>
  );
}
