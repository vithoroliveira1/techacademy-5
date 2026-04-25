export function limparCPF(cpf: string): string {
  return cpf.replace(/[^\d]+/g, '');
}

export function temTamanhoOuRepetido(cpf: string): boolean {
  if (cpf.length !== 11) return true;
  return /^(\d)\1+$/.test(cpf);
}

export function calcularDigito(cpf: string, fator: number): number {
  let soma = 0;
  for (let i = 0; i < fator - 1; i++) soma += parseInt(cpf.charAt(i)) * (fator - i);
  const resto = 11 - (soma % 11);
  return resto >= 10 ? 0 : resto;
}

export function validarCPF(cpf: string): boolean {
  const limpo = limparCPF(cpf);
  if (temTamanhoOuRepetido(limpo)) return false;
  const digito1 = calcularDigito(limpo, 10);
  const digito2 = calcularDigito(limpo, 11);
  return limpo.endsWith(`${digito1}${digito2}`);
}

export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

export function validarSenhaForte(senha: string): boolean {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(senha);
}
