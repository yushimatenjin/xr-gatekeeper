import { useState } from "react";
import type { ReactNode } from "react";
import type { JSX } from "react";
import { useXRGatekeeper } from "./useXRGatekeeper";

export interface XRGatekeeperProps {
  children: ReactNode;
  fallback?: ReactNode;
  loading?: ReactNode;
  title?: string;
  message?: string;
  onVRStart?: () => void;
  onARStart?: () => void;
}

export const XRGatekeeper = ({
  children,
  fallback,
  loading,
  title = "Device Not Compatible",
  message = "This experience requires a WebXR compatible device/browser.",
  onVRStart,
  onARStart,
}: XRGatekeeperProps): JSX.Element => {
  const { isVRSupported, isARSupported, isChecking } = useXRGatekeeper();
  const [started, setStarted] = useState(false);

  if (isChecking) {
    return <>{loading || <div style={defaultStyles.container}>Checking compatibility...</div>}</>;
  }

  const showVR = isVRSupported && !!onVRStart;
  const showAR = isARSupported && !!onARStart;
  const isSupported = showVR || showAR;

  if (started) {
    return <>{children}</>;
  }

  if (!isSupported) {
    const hasRequestedModes = !!onVRStart || !!onARStart;

    return (
      <>
        {fallback || (
          <div style={defaultStyles.container}>
            <div style={defaultStyles.card}>
              <h1 style={defaultStyles.title}>🚫 {title}</h1>
              <p style={defaultStyles.message}>{message}</p>
              {!hasRequestedModes && (
                <p style={{ ...defaultStyles.tag, color: "orange" }}>
                  (Dev Warning: No start callbacks provided)
                </p>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div style={defaultStyles.container}>
      <div style={defaultStyles.card}>
        <h1 style={defaultStyles.title}>Welcome</h1>
        <p style={defaultStyles.message}>Select an experience mode:</p>
        <div style={defaultStyles.buttonGroup}>
          {showVR && (
            <button
              type="button"
              style={defaultStyles.button}
              onClick={() => {
                onVRStart?.();
                setStarted(true);
              }}
            >
              Start VR
            </button>
          )}
          {showVR && showAR && <div style={{ width: "20px" }} />}
          {showAR && (
            <button
              type="button"
              style={defaultStyles.button}
              onClick={() => {
                onARStart?.();
                setStarted(true);
              }}
            >
              Start AR
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

const defaultStyles = {
  container: {
    width: "100vw",
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#121212",
    color: "#ffffff",
    fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  card: {
    maxWidth: "400px",
    padding: "40px",
    backgroundColor: "#1e1e1e",
    borderRadius: "20px",
    textAlign: "center" as const,
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.5)",
    border: "1px solid #333",
  },
  title: {
    fontSize: "2rem",
    fontWeight: "700",
    marginBottom: "1rem",
    color: "#ffffff",
  },
  message: {
    fontSize: "1rem",
    lineHeight: "1.5",
    color: "#aaaaaa",
    marginBottom: "2rem",
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap" as const,
  },
  button: {
    padding: "12px 24px",
    fontSize: "1rem",
    fontWeight: "600",
    color: "#ffffff",
    backgroundColor: "#0070f3",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    minWidth: "120px",
  },
  tag: {
    fontSize: "0.8rem",
    marginTop: "1rem",
  },
};
