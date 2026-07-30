import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const frameProvider = createContext([null, () => {}]);

export function FrameProvider({ children }) {
  const frameState = useState(null);
  return (
    <frameProvider.Provider value={frameState}>
      {children}
    </frameProvider.Provider>
  );
}
