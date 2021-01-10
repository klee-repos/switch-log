export function createUserStore() {
  return {
    email: "",
    senderMessages: [],
    lifeDesignSummary: null,
    totalHoursLogged: 0,
    setEmail(email) {
      this.email = email;
    },
    isLoggedIn: null,
    setIsLoggedIn(isLoggedIn) {
      this.isLoggedIn = isLoggedIn;
    },
    setSenderMessages(senderMessages) {
      this.senderMessages = senderMessages;
    },
    updateASenderMessage(index, message) {
      this.senderMessages[index].senderMessage = message;
    },
    updateAIntent(index, intent) {
      this.senderMessages[index].intent = intent;
    },
    updateAConfidence(index, confidence) {
      this.senderMessages[index].confidence = confidence;
    },
    setLifeDesignSummary(lifeDesignSummary) {
      this.lifeDesignSummary = lifeDesignSummary;
    },
    setTotalHoursLogged(totalHoursLogged) {
      this.totalHoursLogged = totalHoursLogged;
    },
  };
}
