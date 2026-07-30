import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const framedProvider = createContext([null, () => {}]);

export function FramedProvider({ children }) {
  const framedState = useState(null);
  return (
    <framedProvider.Provider value={framedState}>
      {children}
    </framedProvider.Provider>
  );
}
