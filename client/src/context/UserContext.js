import React from "react";
import { createUserStore } from "./UserStore";
import { useLocalStore } from "mobx-react";

const UserContext = React.createContext(null);

export const UserProvider = ({ children }) => {
  const userStore = useLocalStore(createUserStore);

  return (
    <UserContext.Provider value={userStore}>{children}</UserContext.Provider>
  );
};

export const useUserStore = () => React.useContext(UserContext);
