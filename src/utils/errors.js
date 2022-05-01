export class InvalidDomainError extends Error {
    constructor(message) {
      super(message);
  
      this.name = 'InvalidDomainError';
    }
  }

