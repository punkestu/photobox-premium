import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { photosProvider } from "../hooks/usePhotosProvider";
import { framedProvider } from "../hooks/useFramedProvider";
import { frametypeProvider } from "../hooks/useFrametypeProvider";

import * as FramesSingle from "../assets/framessingle";
import * as FrameRenderer from "../utils/framerenderer";
import * as LocalBuffer from "../utils/localbuffer";
import { offlinemodeProvider } from "../hooks/useOfflinemodeProvider";
import { PHOTOBOX_PRESETS } from "../utils/filter/presets";
import { presetProvider } from "../hooks/usePresetProvider";

export default function FramePage() {
  const [frame] = useState(null);
  const [photos, setPhotos] = useContext(photosProvider);
  const [frametype, setFrametype] = useContext(frametypeProvider);
  const [offlinemode] = useContext(offlinemodeProvider);
  const [preset, setPreset] = useContext(presetProvider);
  const setFramed = useContext(framedProvider)[1];

  const displayRef = useRef(null);
  const navigate = useNavigate();

  const retake = () => {
    setPhotos([]);
    setFrametype(null);
    LocalBuffer.deleteObjects();
    setTimeout(() => {
      navigate("/camera");
    }, 100);
  };

  const finish = () => {
    if (!confirm("Anda yakin semua sudah sesuai?")) return;
    if (offlinemode) return navigate("/finish-offline");
    return navigate("/upload");
  };

  useEffect(() => {
    LocalBuffer.getObjects().then((objects) =>
      setPhotos(
        objects
          .filter((object) => object.type == "image_base64")
          .map((object) => object.blob),
      ),
    );
    LocalBuffer.getObject("frame_selected").then((object) =>
      object
        ? setFrametype(
            FramesSingle.all().find((frame) => frame.key == object.blob.key),
          )
        : null,
    );
    LocalBuffer.getObject("framed").then((object) =>
      object ? setFramed(object.blob) : null,
    );
  }, [setPhotos, setFrametype, setFramed]);

  useEffect(() => {
    if (displayRef && frametype) {
      FrameRenderer.render(
        displayRef,
        photos,
        frametype.frame ?? frametype.display,
        frametype,
        preset
      ).then((res) => {
        LocalBuffer.saveObject("framed", "framed_base64", res);
        setFramed(res);
      });
    }
  }, [displayRef, photos, frame, frametype, setFramed, preset]);
  return (
    <main className="p-4 h-full flex flex-col gap-2">
      <header className="w-full flex justify-between gap-2 p-2 bg-white sticky top-0 left-0 rounded-md">
        <button
          onClick={retake}
          className="cursor-pointer bg-red-500 text-white px-2 py-1 rounded-md"
        >
          ⬅️ RETAKE
        </button>
        <button
          onClick={finish}
          className="cursor-pointer bg-red-500 text-white px-2 py-1 rounded-md"
        >
          CONTINUE ➡️
        </button>
      </header>
      <div className="flex justify-center p-4 overflow-auto h-full bg-slate-200 rounded-md">
        <img ref={displayRef} className="h-fit" />
      </div>
      <div className="flex gap-3 justify-center bg-slate-200 p-2 rounded-md">
        <button className={`aspect-square text-5xl ${preset == null ? "bg-yellow-500" : "bg-white"} p-2 rounded-md`} onClick={() => setPreset(null)}>❌</button>
        {Object.keys(PHOTOBOX_PRESETS).map((presetkey) => (
          <button className={`aspect-square text-5xl ${preset == presetkey ? "bg-yellow-500" : "bg-white"} p-2 rounded-md`} onClick={() => setPreset(presetkey)}>{PHOTOBOX_PRESETS[presetkey].icon}</button>
        ))}
      </div>
    </main>
  );
}
