import { useState } from "react";
import { XRGatekeeper } from "react-xr-gatekeeper";

function App() {
  const [sessionStatus, setSessionStatus] = useState<string>("Idle");

  const startVR = () => {
    setSessionStatus("Starting VR Session...");
    setTimeout(() => {
      setSessionStatus("VR Session Active (Simulated)");
    }, 1000);
  };

  const startAR = () => {
    setSessionStatus("Starting AR Session...");
    setTimeout(() => {
      setSessionStatus("AR Session Active (Simulated)");
    }, 1000);
  };

  return (
    <XRGatekeeper
      onVRStart={startVR}
      onARStart={startAR}
      title="WebXR Demo"
      message="Please enter VR or AR to view this content."
    >
      <div style={{ textAlign: "center", padding: "2rem" }}>
        <h1>WebXR Content</h1>
        <p>Current Status: {sessionStatus}</p>
        <div
          style={{
            width: "100%",
            height: "300px",
            background: "linear-gradient(45deg, #ff00cc, #3333ff)",
            borderRadius: "12px",
            marginTop: "2rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span style={{ fontSize: "2rem", fontWeight: "bold" }}>3D SCENE PLACEHOLDER</span>
        </div>
      </div>
    </XRGatekeeper>
  );
}

export default App;
