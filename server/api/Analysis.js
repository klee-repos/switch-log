import _ from "lodash";

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
}

export default Analysis;
