import Navbar from "./Navbar";
import Logs from "./Logs";
import LifeDesignSummary from "./LifeDesignSummary";

const Home = () => {
  const pageToLoad = () => {
    let page = <LifeDesignSummary />;
    let url = window.location.href.split("/");
    let ext = url[3];
    if (ext === "rawLogs") {
      page = <Logs />;
    } else if (ext === "lifeDesignSummary") {
      page = <LifeDesignSummary />
    }
    return page;
  };

  return (
    <>
      <Navbar />
      {pageToLoad()}
    </>
  );
};

export default Home;
