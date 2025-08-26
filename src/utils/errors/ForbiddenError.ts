import { InternalServerError } from "./InternalServerError";

export class ForbiddenError extends InternalServerError {
  constructor(message = 'Forbidden') {
    super(message, 403);
    this.name = 'ForbiddenError';
  }
}