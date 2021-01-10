import React, { useEffect } from "react";
import { useUserStore } from "../context/UserContext";
import { useObserver } from "mobx-react";
import Home from "./Home";
import Login from "./Login";
import Loading from "./Loading";

import { Magic } from "magic-sdk";
const magic = new Magic(process.env.REACT_APP_MAGIC_API_KEY);

const Auth = () => {
  const userStore = useUserStore();
  // const [logStatus, setLogStatus] = React.useState(false)

  useEffect(() => {
    async function authInit() {
      userStore.setIsLoggedIn(await magic.user.isLoggedIn());
      if (userStore.isLoggedIn === true) {
        let userMetadata = await magic.user.getMetadata();
        console.log(userMetadata);
        userStore.setEmail(userMetadata.email);
      }
    }
    authInit();
  }, []);

  return useObserver(() => (
    <div className="home-container">
      {userStore.isLoggedIn !== null ? (
        userStore.isLoggedIn === false ? (
          <Login />
        ) : (
          <div className="home-box">
            <Home />
          </div>
        )
      ) : (
        <Loading />
      )}
    </div>
  ));
};

export default Auth;
