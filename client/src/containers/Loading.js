import Lottie from "react-lottie-player";
import lottieJson from "../assets/lf30_editor_ki04jrpp.json";

const Loading = () => {
  return (
    <div className="home-box">
      <Lottie
        loop
        animationData={lottieJson}
        play
        style={{ width: 150, height: 150 }}
      />
    </div>
  );
};

export default Loading;
