import { InternalServerError } from "./InternalServerError";

export class NotFoundError extends InternalServerError {
  constructor(message = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}