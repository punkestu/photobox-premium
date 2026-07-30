import { useGoogleLogin } from "@react-oauth/google";
import { useContext, useEffect } from "react";
import { credentialProvider } from "./useCredentialProvider";

export default function useGoogle() {
  const setCredential = useContext(credentialProvider)[1];
  useEffect(() => {
    setCredential(localStorage.getItem("credential"));
  }, [setCredential]);

  const login = useGoogleLogin({
    scope: "https://www.googleapis.com/auth/drive.file",
    prompt: "consent",
    onSuccess: (tokenResponse) => {
      const containScopes = [
        "https://www.googleapis.com/auth/drive.file",
      ].reduce((acc, scope) => {
        return acc && tokenResponse.scope.includes(scope);
      }, true);
      if (!containScopes) {
        alert("Izin tidak terpenuhi!");
        return;
      }
      setCredential(tokenResponse.access_token);
      localStorage.setItem("credential", tokenResponse.access_token);
      // localStorage.setItem("refresh_token", tokenResponse.refresh_token);
      localStorage.setItem(
        "credential_expires_at",
        Math.floor(Date.now() / 1000) + tokenResponse.expires_in,
      );
    },
    onError: () => {
      console.log("Login Failed");
    },
  });

  return login;
}
