import { useNavigate } from "react-router";
import Logo120Transparent from "../assets/Logo_border_120px.webp";
import useGoogle from "../hooks/useGoogle";
import { useContext, useEffect } from "react";
import { credentialProvider } from "../hooks/useCredentialProvider";

export default function WelcomePage() {
  const [credential, setCredential] = useContext(credentialProvider);
  useEffect(() => {
    setCredential(localStorage.getItem("credential"));
  }, [setCredential]);
  const login = useGoogle();
  const navigate = useNavigate();
  return (
    <button
      onClick={() => (credential ? navigate("/camera") : login())}
      className="cursor-pointer h-full w-full flex flex-col justify-center items-center text-white"
    >
      <img
        src={Logo120Transparent}
        width={120}
        className="animate-[wiggle_1s_steps(2,end)_infinite]"
      />
      <p className="text-xl tracking-widest font-black mt-4">
        {credential ? "TAP TO START" : "LOGIN"}
      </p>
    </button>
  );
}
