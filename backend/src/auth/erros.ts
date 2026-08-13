export abstract class AuthDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class EmailAlreadyExistsError extends AuthDomainError {
  constructor(email: string) {
    super(`O e-mail ${email} já está em uso.`);
    this.name = 'EmailAlreadyExistsError';
  }
}

export class InvalidCredentialsError extends AuthDomainError {
  constructor() {
    super('Credenciais inválidas.');
    this.name = 'InvalidCredentialsError';
  }
}
export class InvalidTokenError extends AuthDomainError {
  constructor() {
    super('Token ausente ou inválido.');
    this.name = 'InvalidTokenError';
  }
}
