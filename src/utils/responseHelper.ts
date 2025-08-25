import { Request, Response } from 'express';

interface ErrorDetails {
  [key: string]: any;
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export function sendSuccess(req: Request, res: Response, data: any, statusCode = 200) {
  return res.status(statusCode).json(data);
}

export function sendError(
  res: Response,
  code: number,
  message: string,
  details: ErrorDetails | null = null
) {
  return res.status(code).json({
    success: false,
    data: null,
    error: {
      code,
      message,
      details,
    },
    message,
  });
}