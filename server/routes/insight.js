import express from "express";
const router = express.Router();

import Analysis from "../api/Analysis";

const verifyUser = async (magic, did) => {
  try {
    // validate user identity
    const issuer = magic.token.getIssuer(did);
    const metadata = await magic.users.getMetadataByIssuer(issuer);
    console.log(metadata);
    return [ issuer, metadata ];
  } catch (e) {
    console.log(e);
    return null;
  }
};

router.post("/get-message-logs", async (req, res) => {
  try {
    const magic = req.app.get("magic");
    const db = req.app.get("db");
    // validate user identity
    const [issuer, metadata] = await verifyUser(magic, req.body.did);
    console.log(metadata);
    // get user message log
    let analysis = new Analysis(db, metadata.email);
    let results = await analysis.getMessageLogs();
    res.send(results);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post("/update-message-logs", async (req, res) => {
  try {
    const magic = req.app.get("magic");
    const db = req.app.get("db");
    // validate user identity
    const [issuer, metadata] = await verifyUser(magic, req.body.did);
    console.log(metadata);
    // get user message log
    let analysis = new Analysis(db, metadata.email);
    let results = await analysis.updateMessageLogs(req.body.senderMessages);
    res.send(results);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

export default router;
