import { InternalServerError } from "./InternalServerError";

export class UnauthorizedError extends InternalServerError {
  constructor(message = 'Unauthorized') {
    super(message, 401);
    this.name = 'UnauthorizedError';
  }
}