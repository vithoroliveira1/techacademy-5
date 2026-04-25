import React from 'react';
import './common.css';

interface Props {
  type: 'success' | 'error' | 'warning';
  message: string;
}

export function Alert({ type, message }: Props) {
  if (!message) return null;
  return <div className={`alert alert-${type}`}>{message}</div>;
}
