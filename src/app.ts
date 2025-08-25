import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import cors from 'cors';
import session from 'express-session';
import FileStore from 'session-file-store';
import favicon from 'serve-favicon';
import { BASE_DIR } from '@config/paths';

import indexRouter from '@routes/index';
import { ErrorHandler } from './middlewares/ErrorHandler';

const app = express();
app.set('trust proxy', 1);

app.use(favicon(path.join(BASE_DIR, 'src/public/images', 'favicon.ico')));
console.log(path.join(BASE_DIR, 'src/public/images', 'favicon.ico'))

const FileStoreClass = FileStore(session);

app.use(session({
  store: new FileStoreClass({ path: path.join(BASE_DIR, 'data', 'sessions') }),
  secret: process.env.SESSION_SECRET || 'default_secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'prod',
    httpOnly: true,
    maxAge: 60 * 60 * 1000, // 1 hour
    sameSite: "none"
  }
}));

app.set('views', path.join(BASE_DIR, 'src/views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(BASE_DIR, 'src/public/stylesheets')));
app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, HEAD');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, max-age=0, must-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

app.use('/', indexRouter);

app.use(ErrorHandler.handleError);

export default app;