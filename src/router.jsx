import { createBrowserRouter, RouterProvider } from "react-router";
import WelcomePage from "./pages/Welcome";
import CameraPage from "./pages/Camera";
import FramePage from "./pages/Frame";
import UploadPage from "./pages/Upload";
import FinishOfflinePage from "./pages/FinishOffline";

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
  return <RouterProvider router={router} />;
}
