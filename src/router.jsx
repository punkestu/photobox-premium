import { createBrowserRouter, RouterProvider } from "react-router";
import WelcomePage from "./pages/Welcome";
import CameraPage from "./pages/Camera";
import FramePage from "./pages/Frame";
import UploadPage from "./pages/Upload";
import FinishOfflinePage from "./pages/FinishOffline";
import { useEffect } from "react";
import { enableWakeLock } from "./utils/wakelock";

let router = createBrowserRouter([
  {
    path: "/",
    Component: WelcomePage,
  },
  {
    path: "/camera",
    Component: CameraPage,
  },
  {
    path: "/frame",
    Component: FramePage,
  },
  {
    path: "/upload",
    Component: UploadPage,
  },
  {
    path: "/finish-offline",
    Component: FinishOfflinePage,
  },
]);

export default function Router() {
  useEffect(() => {
    enableWakeLock();
  }, []);
  return <RouterProvider router={router} />;
}
