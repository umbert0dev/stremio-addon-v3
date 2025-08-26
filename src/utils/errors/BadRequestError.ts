import { InternalServerError } from "./InternalServerError";

export class BadRequestError extends InternalServerError {
  constructor(message = 'Bad request') {
    super(message, 400);
    this.name = 'BadRequestError';
  }
}