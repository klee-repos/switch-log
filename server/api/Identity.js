import admin from "firebase-admin";

var registerUser = async (
  db,
  senderNumber,
  fromCity,
  fromState,
  fromCountry
) => {
  try {
    let message = "Hey there 👋. Can you tell me your name?";
    db.collection("switchlog-users").doc(senderNumber).set(
      {
        senderNumber,
        fromCity,
        fromState,
        fromCountry,
        senderState: "registration",
      },
      { merge: true }
    );
    return message;
  } catch (e) {
    console.log(e);
    return null;
  }
};

class Identity {
  constructor(
    db,
    senderNumber,
    senderMessage,
    fromCity,
    fromState,
    fromCountry
  ) {
    this.db = db;
    this.senderNumber = senderNumber;
    this.senderMessage = senderMessage;
    this.fromCity = fromCity;
    this.fromState = fromState;
    this.fromCountry = fromCountry;
  }

  async checkRegistration() {
    try {
      let message;
      let snapshot = await this.db
        .collection("switchlog-users")
        .doc(this.senderNumber)
        .get();
      if (snapshot.exists) {
        // register sender name
        if (snapshot.data().senderState === "registration") {
          message =
            `Nice to meet you, ${this.senderMessage}! Tell me when you start new tasks. Then shoot me another text when you finish them. I'm here to track where you spend your time.`;
          this.db.collection("switchlog-users").doc(this.senderNumber).set(
            {
              senderName: this.senderMessage,
              senderState: "active",
            },
            { merge: true }
          );
        }
      } else {
        // ask sender to register
        message = await registerUser(
          this.db,
          this.senderNumber,
          this.fromCity,
          this.fromState,
          this.fromCountry
        );
      }
      return message;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async logMessage() {
    try {
      let message;
      let snapshot = await this.db
        .collection("switchlog-users")
        .doc(this.senderNumber)
        .get();
      if (snapshot.exists) {
        let date = new Date();
        let data = {
          timestamp: date.toISOString(),
          senderMessage: this.senderMessage
        };
        this.db
          .collection("switchlog-user-logs")
          .doc(this.senderNumber)
          .set(
            {
              senderNumber: this.senderNumber,
              logs: admin.firestore.FieldValue.arrayUnion(data),
            },
            { merge: true }
          );
        message = "message logged 📒";
      } else {
        // ask sender to register
        message = await registerUser(
          this.db,
          this.senderNumber,
          this.fromCity,
          this.fromState,
          this.fromCountry
        );
      }
      return message;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}

export default Identity;
