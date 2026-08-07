import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const presetProvider = createContext([null, () => {}]);

export function PresetProvider({ children }) {
  const presetState = useState(null);
  return (
    <presetProvider.Provider value={presetState}>
      {children}
    </presetProvider.Provider>
  );
}
