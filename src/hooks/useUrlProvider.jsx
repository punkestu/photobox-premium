import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const urlProvider = createContext(["", (string) => {console.log(string)}]);

export function UrlProvider({ children }) {
  const urlState = useState("");
  return (
    <urlProvider.Provider value={urlState}>
      {children}
    </urlProvider.Provider>
  );
}
