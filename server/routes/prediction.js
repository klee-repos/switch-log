import express from "express";
const router = express.Router();

import DialogflowEX from "../api/DialogflowEX";
import Analysis from "../api/Analysis";

// authentication
const auth = require("../auth");
router.use(auth);

router.post("/detect-intent", async (req, res) => {
  try {
    const dialogflowEx = new DialogflowEX(process.env.GOOGLE_PROJECT_ID);
    await dialogflowEx.setToken();
    let dfResults = await dialogflowEx.detectIntent(
      req.body.text,
      req.body.languageCode
    );
    res.send(dfResults);
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

router.post("/update-predictions", async (req, res) => {
  try {
    const db = req.app.get("db");
    const dialogflowEx = new DialogflowEX(process.env.GOOGLE_PROJECT_ID);
    await dialogflowEx.setToken();
    let analysis = new Analysis(db, req.body.email);
    let messageLogs = await analysis.getMessageLogs();
    let results = await analysis.updatePredictions(dialogflowEx, messageLogs);
    console.log(results);
    res.sendStatus(200);
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
});

export default router;
