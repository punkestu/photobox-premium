import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const offlinemodeProvider = createContext([true, () => {}]);

export function OfflinemodeProvider({ children }) {
  const offlinemodeState = useState(true);
  return (
    <offlinemodeProvider.Provider value={offlinemodeState}>
      {children}
    </offlinemodeProvider.Provider>
  );
}
