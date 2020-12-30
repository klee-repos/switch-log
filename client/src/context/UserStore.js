export function createUserStore(){
  return {
    email: "",
    setEmail(email) {
      this.email = email
    },
    isLoggedIn: null,
    setIsLoggedIn(isLoggedIn) {
      this.isLoggedIn = isLoggedIn
    }
  }
}