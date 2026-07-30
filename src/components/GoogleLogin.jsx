import { useGoogleLogin } from "@react-oauth/google";
import { useContext, useEffect } from "react";
import { credentialProvider } from "../hooks/useGoogleProvider";

export function GoogleLoginButton({ className = null }) {
  const [credential, setCredential] = useContext(credentialProvider);
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
  return (
    !credential && (
      <button
        className={`${className} bg-white border border-red-800 text-red-800 shadow-lg hover:shadow-blue-950/50 rounded-xl px-6 py-2 cursor-pointer font-semibold flex items-center justify-center gap-1`}
        onClick={login}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 640 640"
          className="w-6"
        >
          {
            "<!--!Font Awesome Free v7.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.-->"
          }
          <path
            fill="#9f0712"
            d="M564 325.8C564 467.3 467.1 568 324 568C186.8 568 76 457.2 76 320C76 182.8 186.8 72 324 72C390.8 72 447 96.5 490.3 136.9L422.8 201.8C334.5 116.6 170.3 180.6 170.3 320C170.3 406.5 239.4 476.6 324 476.6C422.2 476.6 459 406.2 464.8 369.7L324 369.7L324 284.4L560.1 284.4C562.4 297.1 564 309.3 564 325.8z"
          />
        </svg>{" "}
        Masuk Photobox
      </button>
    )
  );
}
