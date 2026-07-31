import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";

import { photosProvider } from "../hooks/usePhotosProvider";
import { frametypeProvider } from "../hooks/useFrametypeProvider";

// import * as Frames from "../assets/frames";
import * as Frames from "../assets/framessingle";
import * as Camera from "../utils/camera";
import * as LocalBuffer from "../utils/localbuffer";

export default function CameraPage() {
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [photos, setPhotos] = useContext(photosProvider);
  const [state, setState] = useState("standby");
  const [timer, setTimer] = useState(3);
  const [flashlight, setFlashlight] = useState(false);
  const [frametype, setFrametype] = useContext(frametypeProvider);

  const screenRef = useRef(null);
  const navigate = useNavigate();

  const start = () => {
    if (state == "start" || !ready || !loaded || !frametype) return;
    setState("start");
    setTimer(3);
  };

  const onTimer = useCallback(() => {
    if (timer > 0) return;
    setTimeout(() => {
      setFlashlight(true);
    }, 50);
    setTimeout(() => {
      const photo = Camera.capture(screenRef);
      setPhotos((prev) => [...prev, photo]);
    }, 100);
    setTimeout(() => {
      setFlashlight(false);
    }, 1000);
    setTimeout(() => {
      setTimer(3);
    }, 1500);
  }, [timer, setPhotos]);

  useEffect(() => {
    if (frametype) {
      LocalBuffer.saveObject("frame_selected", "frame_object", frametype);
    }
  }, [frametype]);

  useEffect(() => {
    if (!ready || photos.length > 0 || loaded) return;
    LocalBuffer.getObjects().then((objects) => {
      setPhotos(
        objects
          .filter((object) => object.type == "image_base64")
          .map((object) => object.blob),
      );
      setLoaded(true);
    });

    LocalBuffer.getObject("frame_selected").then((object) =>
      object ? setFrametype(object.blob) : null,
    );
  }, [ready, setPhotos, photos, loaded, setFrametype]);

  useEffect(() => {
    if (photos.length > 0) {
      LocalBuffer.saveObject(
        `photo_${photos.length}`,
        "image_base64",
        photos.at(-1),
      );
    }
    if (frametype && photos.length >= frametype.framecount) {
      setTimeout(() => {
        setState("finish");
      }, 100);
      setTimeout(() => {
        navigate("/frame");
      }, 1000);
    }
  }, [photos, navigate, frametype]);

  useEffect(() => {
    if (screenRef) {
      Camera.init(screenRef).then(() => setReady(true));
      return () => Camera.close(screenRef);
    }
  }, [screenRef]);

  useEffect(() => {
    if (state != "start") return;
    if (timer > 0) {
      const timeoutId = setTimeout(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
    onTimer();
  }, [state, timer, onTimer]);

  return (
    <main
      className={`h-full w-full p-8 relative flex justify-center items-center`}
    >
      <section className="bg-white/50 max-w-full max-h-full portrait:w-full landscape:h-full rounded-lg border-4 border-yellow-400 relative">
        <video
          ref={screenRef}
          autoPlay
          playsInline
          className="scale-x-[-1] max-w-full max-h-full portrait:w-full landscape:h-full bg-white/75 rounded-sm aspect-4/3 object-cover object-center flex justify-center items-center"
          style={{
            aspectRatio:
              frametype && frametype.ratio
                ? `${frametype.ratio[0]}/${frametype.ratio[1]}`
                : "4/3",
          }}
        ></video>
      </section>
      <button
        onClick={start}
        className={`h-full w-full cursor-pointer text-white font-semibold text-2xl absolute top-0 left-0 flex justify-center items-center ${flashlight ? "bg-white" : ""}`}
      >
        {state == "standby" ? "Press to Start" : ""}
        {state == "start" && timer > 0 ? (
          <span className="text-4xl aspect-square bg-slate-500/50 w-20 flex justify-center items-center rounded-full">
            {timer}
          </span>
        ) : (
          ""
        )}
      </button>
      {state == "standby" && !frametype && (
        <div className="absolute top-1/2 left-1/2 -translate-1/2 bg-white w-[90%] h-[90%] p-2 rounded-md overflow-y-auto grid grid-cols-3 gap-4">
          <h1 className="col-span-full text-center p-2 font-semibold text-2xl sticky top-0 bg-white">
            Pilih Tipe Strip
          </h1>
          {Frames.all().map((frame) => (
            <label
              className="aspect-square bg-slate-200"
              key={`frame_type_${frame.key}`}
            >
              <input
                type="radio"
                name="frame-type"
                value={frame.key}
                checked={frametype?.key == frame.key}
                onChange={() => {
                  setFrametype(frame);
                }}
                className="peer sr-only"
              />
              <img
                src={frame.display}
                alt=""
                className="h-full w-full object-contain p-2 rounded bg-transparent peer-checked:bg-blue-500 peer-checked:border-0 border border-slate-500"
              />
            </label>
          ))}
        </div>
      )}
      <section className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        {photos.map((photo, i) => (
          <div
            key={`preview_photo_${i}`}
            className="w-40 aspect-4/3 border-2 border-yellow-400 rounded-md bg-white"
            style={{
              aspectRatio:
                frametype && frametype.ratio
                  ? `${frametype.ratio[0]}/${frametype.ratio[1]}`
                  : "4/3",
            }}
          >
            <img
              src={photo}
              alt={`preview_photo_${i}`}
              className="w-full h-full object-cover rounded-sm"
            />
          </div>
        ))}
      </section>
    </main>
  );
}
