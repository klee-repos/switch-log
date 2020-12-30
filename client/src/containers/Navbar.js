import { useUserStore } from "../context/UserContext";
import { Magic } from "magic-sdk";
const magic = new Magic(process.env.REACT_APP_MAGIC_API_KEY);

const Navbar = () => {
  const userStore = useUserStore();

  // Magic logout handler
  const handleLogout = async () => {
    console.log('called')
    await magic.user.logout();
    userStore.setIsLoggedIn(await magic.user.isLoggedIn());
    userStore.setEmail("");
  };

  return (
    <div className="top-navbar">
      <div className="top-navbar-left">
        <div className="navbar-logo">
          <span className="navbar-logo-text">Playground</span>
        </div>
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
