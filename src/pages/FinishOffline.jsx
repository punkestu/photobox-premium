import { useContext, useEffect } from "react";
import { PrintImage } from "../utils/cleanterdriver";
import { framedProvider } from "../hooks/useFramedProvider";

import * as LocalBuffer from "../utils/localbuffer";

export default function FinishOfflinePage() {
  const [framed] = useContext(framedProvider);
  useEffect(() => {
    LocalBuffer.deleteObjects();
    PrintImage(framed);
  }, [framed]);
  return <img src={framed} />;
}
