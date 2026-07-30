import { useContext, useEffect } from "react";
import { PrintImage } from "../utils/cleanterdriver";
import { frameProvider } from "../hooks/useFrameProvider";

export default function FinishOfflinePage() {
  const [frame] = useContext(frameProvider);
  useEffect(() => {
    PrintImage(frame);
  }, [frame]);
  return <h1>Finish Offline</h1>;
}
