import { useHistory } from "react-router-dom";
import { useUserStore } from "../context/UserContext";
import { Magic } from "magic-sdk";
const magic = new Magic(process.env.REACT_APP_MAGIC_API_KEY);

const Navbar = () => {
  const history = useHistory();
  const userStore = useUserStore();

  // Magic logout handler
  const handleLogout = async () => {
    await magic.user.logout();
    userStore.setIsLoggedIn(await magic.user.isLoggedIn());
    userStore.setEmail("");
  };

  const handleRawLogNav = async () => {
    history.push("/rawLogs");
  };

  const handleSummaryNav = async () => {
    history.push("/lifeDesignSummary");
  };

  return (
    <div className="top-navbar">
      <div className="top-navbar-left">
        <div className="navbar-logo">
          <span className="navbar-logo-text">Switch Log</span>
        </div>
        <span className="nav-button" onClick={handleSummaryNav}>
          Summary
        </span>
        <span className="nav-button" onClick={handleRawLogNav}>
          Logs
        </span>
      </div>
      <div className="top-navbar-right">
        <div className="top-navbar-right">
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
