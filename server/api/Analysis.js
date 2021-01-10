import _ from "lodash";
import { VariableInstance } from "twilio/lib/rest/serverless/v1/service/environment/variable";

const findUser = async (db, email) => {
  try {
    let found = [];
    let snapshotUsers = await db
      .collection("switchlog-users")
      .where("email", "==", email)
      .get();
    snapshotUsers.forEach((doc) => {
      found.push(doc.data());
    });
    return found;
  } catch (e) {
    console.log(e);
    return null;
  }
};

class Analysis {
  constructor(db, email) {
    this.db = db;
    this.email = email;
    this.senderNumber;
  }

  async getMessageLogs() {
    try {
      let found = await findUser(this.db, this.email);
      this.senderNumber = found[0].senderNumber;
      let userLogs;
      let snapshotUserLogs = await this.db
        .collection("switchlog-user-logs")
        .doc(this.senderNumber)
        .get();
      if (snapshotUserLogs.exists) {
        userLogs = snapshotUserLogs.data();
        userLogs.logs = _.sortBy(userLogs.logs, ["timestamp"]).reverse();
      }
      return userLogs;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async updateMessageLogs(logs) {
    try {
      let found = await findUser(this.db, this.email);
      this.senderNumber = found[0].senderNumber;
      let results = await this.db
        .collection("switchlog-user-logs")
        .doc(this.senderNumber)
        .set(
          {
            logs,
          },
          { merge: true }
        );
      return results;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async updatePredictions(dialogflowEx, messageLogs) {
    try {
      for (let l in messageLogs.logs) {
        let dfResults = await dialogflowEx.detectIntent(
          messageLogs.logs[l].senderMessage,
          "en"
        );
        messageLogs.logs[l].intent = dfResults.intent;
        messageLogs.logs[l].confidence = dfResults.confidence;
      }
      let results = await this.db
        .collection("switchlog-user-logs")
        .doc(this.senderNumber)
        .set(
          {
            logs: messageLogs.logs,
          },
          { merge: true }
        );
      return results;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getLifeDesignSummary(messages) {
    try {
      let summary = {
        health: 0,
        work: 0,
        play: 0,
        love: 0,
      };
      let logs = _.sortBy(messages.logs, ["timestamp"]);
      console.log(logs);
      for (let l = 0; l < logs.length; l++) {
        let startLog = logs[l];
        let endLog = logs[l + 1];
        if (startLog.intent !== "complete" && endLog) {
          let dateStart = new Date(startLog.timestamp);
          let dateEnd = new Date(endLog.timestamp);
          var duration = Math.abs(dateEnd - dateStart) / 1000;
          var durationInHours = (duration / 3600) % 24;
          summary[startLog.intent] += Math.round(durationInHours * 100) / 100;
          console.log(startLog, endLog);
          console.log(`hours: ${durationInHours}`);
        }
      }
      return summary;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}

export default Analysis;
