import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Router from "./router";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CredentialProvider } from "./hooks/useCredentialProvider";
import { PhotosProvider } from "./hooks/usePhotosProvider";
import { FramedProvider } from "./hooks/useFramedProvider";
import { FrametypeProvider } from "./hooks/useFrametypeProvider";
import { OfflinemodeProvider } from "./hooks/useOfflinemodeProvider";
import { PresetProvider } from "./hooks/usePresetProvider";
import { UrlProvider } from "./hooks/useUrlProvider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <CredentialProvider>
        <PhotosProvider>
          <FramedProvider>
            <FrametypeProvider>
              <OfflinemodeProvider>
                <PresetProvider>
                  <UrlProvider>
                    <Router />
                  </UrlProvider>
                </PresetProvider>
              </OfflinemodeProvider>
            </FrametypeProvider>
          </FramedProvider>
        </PhotosProvider>
      </CredentialProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
