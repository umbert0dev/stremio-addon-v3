import express from 'express';
import * as ApiController from '@controllers/api';
import { exec } from "child_process";

const router = express.Router();

router.get("/", (req, res) => {
  exec("top -w 150 -b -n 1 | head -50", (err, stdout, stderr) => {
    if (err) {
      return res.json({ error: err.message });
    }
    res.json({ output: stdout });
  });
});

export default router;