import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import routes from './routes';
import { UserProvider } from "./context/UserContext";

ReactDOM.render(
  <React.StrictMode>
    <UserProvider>
      {routes}
    </UserProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
