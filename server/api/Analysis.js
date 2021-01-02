import _ from "lodash";

const findUser = async (db, email) => {
  let found = [];
  let snapshotUsers = await db
    .collection("switchlog-users")
    .where("email", "==", email)
    .get();
  snapshotUsers.forEach((doc) => {
    found.push(doc.data());
  });
  return found;
};

class Analysis {
  constructor(db, email) {
    this.db = db;
    this.email = email;
  }

  async getMessageLogs() {
    try {
      let found = await findUser(this.db, this.email);
      let senderNumber = found[0].senderNumber;
      let userLogs;
      let snapshotUserLogs = await this.db
        .collection("switchlog-user-logs")
        .doc(senderNumber)
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
      let senderNumber = found[0].senderNumber;
      let results = await this.db
        .collection("switchlog-user-logs")
        .doc(senderNumber)
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
}

export default Analysis;
