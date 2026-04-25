import React from 'react';
import './common.css';

interface Props extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  options: { label: string; value: string | number }[];
}

export function Select({ label, error, options, ...rest }: Props) {
  return (
    <div className="input-container">
      <label className="input-label">{label}</label>
      <select className={`input-field ${error ? 'input-error' : ''}`} {...rest}>
        <option value="">Selecione...</option>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
}
