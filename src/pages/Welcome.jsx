import { useNavigate } from "react-router";
import Logo120Transparent from "../assets/Logo_border_120px.webp";
import { useContext, useEffect, useState } from "react";
import { preloadFrames } from "../utils/autoloadframes";
import { urlProvider } from "../hooks/useUrlProvider";
import { getSetting, saveSetting } from "../utils/localbuffer";

export default function WelcomePage() {
  const [ready, setReady] = useState(false);
  const [urldrive, setUrldrive] = useContext(urlProvider);
  const navigate = useNavigate();

  useEffect(() => {
    preloadFrames().then(() => setReady(true));
    getSetting("urldrive").then(res => setUrldrive(res));
  }, [setUrldrive]);

  useEffect(()=>{
    if (urldrive) {
      saveSetting("urldrive", urldrive);
    }
  }, [urldrive]);

  return (
    <>
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
      <button
        className="absolute top-2 right-2 text-4xl p-2"
        onClick={() => document.getElementById("setting").showModal()}
      >
        ⚙️
      </button>
      <dialog
        id="setting"
        className="left-1/2 top-1/2 -translate-1/2 rounded-md"
      >
        <div className="p-4 rounded-md flex flex-col gap-2">
          <div className="flex justify-between">
            <h2 className="font-semibold">Setting</h2>
            <button onClick={() => document.getElementById("setting").close()}>
              ❌
            </button>
          </div>
          <div>
            <label htmlFor="urldrive">URL Google Drive (Offline mode)</label>
            <br />
            <input
              type="text"
              id="urldrive"
              className="w-full border px-2 py-1 rounded-md"
              onChange={(e) => setUrldrive(e.target.value)}
              value={urldrive}
            />
          </div>
        </div>
      </dialog>
    </>
  );
}
