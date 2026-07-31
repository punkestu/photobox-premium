import { useContext, useEffect, useState } from "react";
import { PrintImage, thermalOptimize } from "../utils/cleanterdriver";
import { framedProvider } from "../hooks/useFramedProvider";

import * as LocalBuffer from "../utils/localbuffer";
import LogoBorderTypo from "../assets/Logo_border_typo.webp";
import { QRCodeCanvas } from "qrcode.react";
import { photosProvider } from "../hooks/usePhotosProvider";
import { downloadBase64 } from "../utils/downloader";
import { frametypeProvider } from "../hooks/useFrametypeProvider";

function QR({ value, className }) {
  return (
    <div className={`bg-white rounded-lg p-4 ${className}`}>
      <QRCodeCanvas value={value} size={260} />
    </div>
  );
}

export default function FinishOfflinePage() {
  const [framed, setFramed] = useContext(framedProvider);
  const [photos, setPhotos] = useContext(photosProvider);
  const setFrametype = useContext(frametypeProvider)[1];
  const [optimizedframed, setOptimizedframed] = useState(null);
  const [printing, setPrinting] = useState(false);

  const reset = async () => {
    await LocalBuffer.deleteObjects();
    setPhotos([]);
    setFramed(null);
    setFrametype(null);
    window.location.href = "/";
  };
  const reprint = () => {
    thermalOptimize(framed).then((res) => {
      PrintImage(res);
    });
  };
  const download = () => {
    const now = new Date().getSeconds();
    photos.map((photo, i) => {
      downloadBase64(photo, `${now}_photo_${i + 1}`);
    });
    downloadBase64(framed, `${now}_framed`);
  };

  useEffect(() => {
    if (framed && photos.length > 0) return;
    LocalBuffer.getObjects().then((objects) =>
      setPhotos(
        objects
          .filter((object) => object.type == "image_base64")
          .map((object) => object.blob),
      ),
    );
    LocalBuffer.getObject("framed").then((object) =>
      object ? setFramed(object.blob) : null,
    );
  }, [setFramed, framed, photos, setPhotos]);
  useEffect(() => {
    thermalOptimize(framed).then((res) => {
      PrintImage(res);
      setOptimizedframed(res);
    });
    LocalBuffer.saveObject("framed", "framed_base64", framed);
  }, [framed]);
  useEffect(() => {
    setTimeout(() => {
      setPrinting(true);
    }, 100);
  }, [optimizedframed]);
  return (
    <main className="h-screen flex gap-4">
      <aside className="p-8 flex flex-col gap-4 justify-center items-center grow">
        <img src={LogoBorderTypo} width={120} />
        <QR value={"https://youtube.com"} />
        <div className="flex flex-col justify-center items-center gap-2">
          <button
            onClick={reset}
            className="cursor-pointer bg-red-500 text-white px-6 py-2 w-75 rounded-md"
          >
            Refresh
          </button>
          <button
            onClick={reprint}
            className="cursor-pointer bg-red-500 text-white px-6 py-2 w-75 rounded-md"
          >
            Reprint
          </button>
          <button
            onClick={download}
            className="cursor-pointer bg-red-500 text-white px-6 py-2 w-75 rounded-md"
          >
            Download
          </button>
        </div>
      </aside>
      <aside className="h-screen flex flex-col items-center p-8 gap-4 pb-0 grow">
        <div className="flex flex-col items-center justify-center -mb-7">
          <div className="w-76 h-5 bg-slate-50"></div>
          <div className="w-76 h-3 bg-slate-300"></div>
        </div>
        <div className="grow overflow-y-auto hide-scrollbar relative shadow-inner w-70">
          <div className="w-full h-5 bg-linear-to-b from-gray-500 to-transparent sticky top-0 z-10"></div>
          <img
            src={optimizedframed}
            className={`w-full absolute top-0 ${printing ? "animate-print" : ""}`}
          />
        </div>
      </aside>
    </main>
  );
}
