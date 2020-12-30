import { useUserStore } from "../context/UserContext";
import { useObserver } from "mobx-react";

import { Magic } from "magic-sdk";
const magic = new Magic(process.env.REACT_APP_MAGIC_API_KEY);

const Login = () => {
  const userStore = useUserStore();

  const updateEmail = (e) => {
    userStore.setEmail(e.target.value);
  };

  // Magic Login Handler
  const handleLogin = async () => {
    try {
      let email = document.getElementById("email-input").value;
      if (email) {
        await magic.auth.loginWithMagicLink({ email });
        userStore.setIsLoggedIn(await magic.user.isLoggedIn());
        let userMetadata = await magic.user.getMetadata();
        userStore.setEmail(userMetadata.email);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return useObserver(() => (
    <div className="home-box">
      <input
        id="email-input"
        className="login-input"
        value={userStore.email}
        placeholder="Enter email to login"
        onChange={updateEmail}
        type="email"
      />
      <button className="auth-button" onClick={handleLogin}>
        Login
      </button>
    </div>
  ));
};

export default Login;
