import express from "express";
const router = express.Router();

import Analysis from '../api/Analysis';

router.post("/get-message-logs", async (req, res) => {
  try {
    const magic = req.app.get('magic');
    const db = req.app.get('db');
    // validate user identity
    const issuer =  magic.token.getIssuer(req.body.did);
    const metadata = await magic.users.getMetadataByIssuer(issuer);
    console.log(metadata);
    // get user message log
    let analysis = new Analysis(db , metadata.email);
    let results = await analysis.getMessageLogs();
    res.send(results);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

export default router;
