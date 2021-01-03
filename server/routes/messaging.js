import express from "express";
import Bot from "../api/Bot";
const router = express.Router();
const MessagingResponse = require("twilio").twiml.MessagingResponse;

import DialogflowEX from "../api/DialogflowEX";

// authentication
const auth = require("../auth");
router.use(auth);

router.post("/sms", async (req, res) => {
  try {
    let db = req.app.get("db");
    let message;
    // sender info
    let senderMessage = req.body.Body;
    let senderNumber = req.body.From;
    let fromState = req.body.FromState;
    let fromCity = req.body.FromCity;
    let fromCountry = req.body.FromCountry;
    let bot = new Bot(
      db,
      senderNumber,
      senderMessage,
      fromCity,
      fromState,
      fromCountry
    );
    // check if sender is registered
    message = await bot.checkRegistration();
    // log message if sender is registered
    if (!message) {
      let dialogflowEx = new DialogflowEX(process.env.GOOGLE_PROJECT_ID);
      await dialogflowEx.setToken();
      let dfResults = await dialogflowEx.detectIntent(req.body.Body, "en");
      message = await bot.logMessage(dfResults);
    }
    // twilio sms
    const twiml = new MessagingResponse();
    twiml.message(message);
    res.writeHead(200, { "Content-Type": "text/xml" });
    res.end(twiml.toString());
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
});

export default router;
