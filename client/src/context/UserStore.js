export function createUserStore() {
  return {
    email: "",
    setEmail(email) {
      this.email = email;
    },
    isLoggedIn: null,
    setIsLoggedIn(isLoggedIn) {
      this.isLoggedIn = isLoggedIn;
    },
    senderMessages: [],
    setSenderMessages(senderMessages) {
      this.senderMessages = senderMessages;
    },
    updateASenderMessage(index, message) {
      this.senderMessages[index].senderMessage = message;
    },
  };
}
