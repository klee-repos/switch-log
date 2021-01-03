import axios from "axios";
import { JWT } from "google-auth-library";
import serviceKeys from "../serviceKeys.json";
import { v4 as uuidv4 } from "uuid";

const dialogflowURL = `https://dialogflow.googleapis.com/v2beta1`;

class DialogflowEX {
  constructor(googleProject) {
    this.googleProject = googleProject;
    this.googleToken;
  }

  async setToken() {
    try {
      const client = new JWT({
        email: serviceKeys[this.googleProject].client_email,
        key: serviceKeys[this.googleProject].private_key,
        scopes: ["https://www.googleapis.com/auth/cloud-platform"],
      });
      const url = `https://dialogflow.googleapis.com/v2beta1/projects/${this.googleProject}/agent`;
      const res = await client.request({ url });
      const tokenInfo = await client.getTokenInfo(
        client.credentials.access_token
      );
      this.googleToken = client.gtoken.rawToken.access_token;
      return client.gtoken.rawToken.access_token;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async detectIntent(text, languageCode) {
    try {
      let results = await axios({
        method: "POST",
        url: `${dialogflowURL}/projects/${
          this.googleProject
        }/locations/us/agent/sessions/${uuidv4()}:detectIntent`,
        headers: { Authorization: `Bearer ${this.googleToken}` },
        data: {
          queryInput: {
            text: {
              text,
              languageCode,
            },
          },
        },
      });
      return {
        intent: results.data.queryResult.intent.displayName,
        confidence: results.data.queryResult.intentDetectionConfidence,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}

export default DialogflowEX;
