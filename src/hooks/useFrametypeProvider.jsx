import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const frametypeProvider = createContext([null, () => {}]);

export function FrametypeProvider({ children }) {
  const frametypeState = useState(null);
  return (
    <frametypeProvider.Provider value={frametypeState}>
      {children}
    </frametypeProvider.Provider>
  );
}
