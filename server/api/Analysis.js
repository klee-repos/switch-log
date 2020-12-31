import _ from 'lodash';

class Analysis {
  constructor(db, email) {
    this.db = db;
    this.email = email;
  }

  async getMessageLogs() {
    try {
      let found = [];
      let snapshotUsers = await this.db
        .collection("switchlog-users")
        .where("email", "==", this.email)
        .get();
      snapshotUsers.forEach((doc) => {
        found.push(doc.data());
      });
      let senderNumber = found[0].senderNumber;
      let userLogs;
      let snapshotUserLogs = await this.db
        .collection("switchlog-user-logs")
        .doc(senderNumber)
        .get();
      if (snapshotUserLogs.exists) {
        userLogs = snapshotUserLogs.data();
        console.log(userLogs)
        userLogs.logs = _.sortBy(userLogs.logs, ["timestamp"]).reverse();
      }
      console.log(userLogs)
      return userLogs
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}

export default Analysis;
