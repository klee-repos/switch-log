import express from "express";
const router = express.Router();

import DialogflowEX from "../api/DialogflowEX";

// authentication
const auth = require("../auth");
router.use(auth);

router.post("/detect-intent", async (req, res) => {
  try {
    let dialogflowEx = new DialogflowEX(process.env.GOOGLE_PROJECT_ID);
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

export default router;
