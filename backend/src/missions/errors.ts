export abstract class MissionsDomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class MissionNotFoundError extends MissionsDomainError {
  constructor() {
    super('A missão solicitada não foi encontrada.');
    this.name = 'MissionNotFoundError';
  }
}

export class MissionAlreadyCompletedError extends MissionsDomainError {
  constructor() {
    super('Você já completou esta missão.');
    this.name = 'MissionAlreadyCompletedError';
  }
}
