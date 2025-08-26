import { Request, Response, NextFunction } from 'express';

import 'express-session';

declare module 'express-session' {
  interface SessionData {
    loggedIn?: boolean;
  }
}

export class AuthMw {
  static isAuthenticatedApi = (req: Request, res: Response, next: NextFunction) => {
    if (req.session?.loggedIn) {
        return next();
    }
    res.sendStatus(401);
  };

  static isAuthenticatedWeb = (req: Request, res: Response, next: NextFunction) => {
    if (req.session?.loggedIn) {
        return next();
    }
    res.redirect('/login');
  };
}