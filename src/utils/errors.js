export class InvalidDomainError extends Error {
    constructor(message) {
      super(message);
  
      this.name = 'InvalidDomainError';
    }
  }

export class InvalidCourseIDError extends Error {
    constructor(message) {
      super(message);
  
      this.name = 'InvalidCourseIDError';
    }
  }
