import { InternalServerError } from "./InternalServerError";

export class MethodNotAllowedError extends InternalServerError {
  constructor(message = 'Method Not Allowed') {
    super(message, 405);
    this.name = 'MethodNotAllowedError';
  }
}