import { createContext, useState } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const credentialProvider = createContext([null, () => {}]);

export function CredentialProvider({ children }) {
  const credentialState = useState(null);
  return (
    <credentialProvider.Provider value={credentialState}>
      {children}
    </credentialProvider.Provider>
  );
}
