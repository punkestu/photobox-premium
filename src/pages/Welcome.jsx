import { useNavigate } from "react-router";
import Logo120Transparent from "../assets/Logo_border_120px.webp";
import { useEffect, useState } from "react";
import { preloadFrames } from "../utils/autoloadframes";

export default function WelcomePage() {
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    preloadFrames().then(() => setReady(true));
  }, []);

  return (
    <button
      disabled={!ready}
      onClick={() => navigate("/camera")}
      className="cursor-pointer h-full w-full flex flex-col justify-center items-center text-white"
    >
      <img
        src={Logo120Transparent}
        width={120}
        className="animate-[wiggle_1s_steps(2,end)_infinite]"
      />
      <p className="text-xl tracking-widest font-black mt-4">
        {/* {credential ? "TAP TO START" : "LOGIN"} */}
        TAP TO START
      </p>
    </button>
  );
}
