import { useContext, useEffect, useState } from "react";
import { PrintImage, thermalOptimize } from "../utils/cleanterdriver";
import { framedProvider } from "../hooks/useFramedProvider";

import * as LocalBuffer from "../utils/localbuffer";
import { useNavigate } from "react-router";
import LogoBorderTypo from "../assets/Logo_border_typo.webp";
import { QRCodeCanvas } from "qrcode.react";

function QR({ value, className }) {
  return (
    <div className={`bg-white rounded-lg p-4 ${className}`}>
      <QRCodeCanvas value={value} size={260} />
    </div>
  );
}

export default function FinishOfflinePage() {
  const [framed, setFramed] = useContext(framedProvider);
  const [optimizedframed, setOptimizedframed] = useState(null);
  const [printing, setPrinting] = useState(false);
  const navigate = useNavigate();

  const reset = () => {
    LocalBuffer.deleteObjects();
    navigate("/");
  };
  const reprint = () => {
    thermalOptimize(framed).then((res) => {
      PrintImage(res);
    });
  };

  useEffect(() => {
    if (framed) return;
    LocalBuffer.getObject("framed").then((object) =>
      object ? setFramed(object.blob) : null,
    );
  }, [setFramed, framed]);
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
    <main className="h-screen flex flex-col items-center p-8 gap-4 pb-0">
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
      </div>
      <div className="flex flex-col items-center justify-center -mb-7">
        <div className="w-75 h-5 bg-slate-50"></div>
        <div className="w-75 h-3 bg-slate-300"></div>
      </div>
      <div className="grow overflow-y-auto relative shadow-inner w-70">
        <div className="w-full h-5 bg-linear-to-b from-gray-500 to-transparent absolute z-10"></div>
        <img
          src={optimizedframed}
          className={`w-full ${printing ? "animate-print" : ""}`}
        />
      </div>
    </main>
  );
}
