import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { photosProvider } from "../hooks/usePhotosProvider";
import { framedProvider } from "../hooks/useFramedProvider";
import { frametypeProvider } from "../hooks/useFrametypeProvider";

import * as FrameRenderer from "../utils/framerenderer";
import * as LocalBuffer from "../utils/localbuffer";
import { offlinemodeProvider } from "../hooks/useOfflinemodeProvider";

export default function FramePage() {
  const [frame] = useState(null);
  const [photos, setPhotos] = useContext(photosProvider);
  const [frametype, setFrametype] = useContext(frametypeProvider);
  const [offlinemode] = useContext(offlinemodeProvider);
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
      object ? setFrametype(object.blob) : null,
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
        frametype.display,
        frametype,
      ).then((res) => {
        LocalBuffer.saveObject("framed", "framed_base64", res);
        setFramed(res);
      });
    }
  }, [displayRef, photos, frame, frametype, setFramed]);
  return (
    <main className="p-4 h-full flex flex-col gap-4">
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
      {/* <div className="overflow-x-auto h-[90%] bg-slate-200 py-2 px-4">
            <div className="w-fit flex gap-8 h-full">
              <button
                onClick={() => setFrame(null)}
                className="h-full w-50 bg-red-300 cursor-pointer flex justify-center items-center p-2"
              >
                CLEAR
              </button>
              {frametype &&
                FrameManager.all()
                  .find((frame) => frame.key == frametype.key)
                  .frames.map((frame, i) => (
                    <button
                      onClick={() => setFrame(frame)}
                      key={`frame_${i}`}
                      className="h-full w-50 bg-blue-400/50 cursor-pointer flex justify-center items-center p-2"
                    >
                      <img
                        src={frame}
                        alt=""
                        className="h-full w-full object-contain"
                      />
                    </button>
                  ))}
            </div>
          </div> */}
    </main>
  );
}
