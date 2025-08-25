import express, { Request, Response, NextFunction } from "express";
import path from "path";
import fs from 'fs';

import streamRouter from "@routes/stream";
import catalogRouter from "@routes/catalog";
import metaRouter from "@routes/meta";
import apiRouter from "@routes/api";
import proxyRouter from "@routes/proxy";
import m3u8Router from "@routes/m3u8";
import segmentRouter from "@routes/segment";
import viewsRouter from "@routes/views";

import manifest from "@config/manifest.json";
import { BASE_DIR } from '@config/paths';

const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
  const filePath = path.join(BASE_DIR, 'src/public/html/index.html');
  let html = fs.readFileSync(filePath, 'utf-8');
  let protocol = req.protocol;
  let host = req.get('host');
  let manifestDomain = `${protocol}://${host}`;
  html = html.replace('{{_DOMAIN_}}', manifestDomain);
  res.send(html);
});

router.get("/manifest.json", (req: Request, res: Response) => {
  res.json(manifest);
});

router.use("/stream", streamRouter);
router.use("/catalog", catalogRouter);
router.use("/meta", metaRouter);
router.use('/api', apiRouter);
router.use('/proxy', proxyRouter);
router.use('/m3u8', m3u8Router);
router.use('/segment', segmentRouter);
router.use(viewsRouter);

export default router;