import express, { Request, Response } from "express";
import * as proxyController from "@controllers/proxy";

const router = express.Router();

router.head('/:service', (req, res) => {
    res.status(200).send();
});

router.get('/:service', async (req, res) => {
    const { service } = req.params;
    if (['rojadirecta'].includes(service)) {
      let m3u8Content = await proxyController.getM3u8Content(req, res);
      res.setHeader("Content-Type", "application/vnd.apple.mpegurl");
      res.send(m3u8Content);
    } else {
      	res.status(404).send('Servizio non supportato');
    }
});

export = router;