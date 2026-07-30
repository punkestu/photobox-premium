import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const photosProvider = createContext([[], () => {}]);

export function PhotosProvider({ children }) {
  const photosState = useState([]);
  return (
    <photosProvider.Provider value={photosState}>
      {children}
    </photosProvider.Provider>
  );
}
