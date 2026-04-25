import React from 'react';
import './common.css';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, ...rest }: Props) {
  return (
    <div className="input-container">
      <label className="input-label">{label}</label>
      <input className={`input-field ${error ? 'input-error' : ''}`} {...rest} />
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
}
