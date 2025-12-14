import { useState, useMemo, useCallback } from "react";
import type { ReactNode } from "react";
import type { JSX } from "react";
import { useXRGatekeeper } from "./useXRGatekeeper";

/**
 * Props for the XRGatekeeper component
 */
export interface XRGatekeeperProps {
  /** Content to display when XR session is active */
  children: ReactNode;
  /** Custom fallback UI when XR is not supported */
  fallback?: ReactNode;
  /** Custom loading UI while checking XR support */
  loading?: ReactNode;
  /** Title text for the error message */
  title?: string;
  /** Error message text */
  message?: string;
  /** Callback when VR session starts */
  onVRStart?: () => void;
  /** Callback when AR session starts */
  onARStart?: () => void;
  /** Custom CSS class name for the container */
  className?: string;
}

/**
 * XRGatekeeper component that conditionally renders content based on WebXR support.
 *
 * This component checks for WebXR support and only renders children when an XR session
 * is active. It provides a UI for selecting VR or AR modes when supported.
 *
 * @param props - Component props
 * @returns JSX element
 *
 * @example
 * ```tsx
 * <XRGatekeeper
 *   onVRStart={() => console.log("VR started")}
 *   onARStart={() => console.log("AR started")}
 * >
 *   <YourXRContent />
 * </XRGatekeeper>
 * ```
 */
export const XRGatekeeper = ({
  children,
  fallback,
  loading,
  title = "Device Not Compatible",
  message = "This experience requires a WebXR compatible device/browser.",
  onVRStart,
  onARStart,
  className,
}: XRGatekeeperProps): JSX.Element => {
  const { isVRSupported, isARSupported, isChecking, error } = useXRGatekeeper();
  const [started, setStarted] = useState(false);

  const handleVRStart = useCallback(() => {
    onVRStart?.();
    setStarted(true);
  }, [onVRStart]);

  const handleARStart = useCallback(() => {
    onARStart?.();
    setStarted(true);
  }, [onARStart]);

  const showVR = useMemo(() => isVRSupported && !!onVRStart, [isVRSupported, onVRStart]);
  const showAR = useMemo(() => isARSupported && !!onARStart, [isARSupported, onARStart]);
  const isSupported = useMemo(() => showVR || showAR, [showVR, showAR]);
  const hasRequestedModes = useMemo(() => !!onVRStart || !!onARStart, [onVRStart, onARStart]);

  // Loading state
  if (isChecking) {
    return (
      <>
        {loading || (
          <div style={defaultStyles.container} className={className}>
            <div style={defaultStyles.card}>
              <output
                style={defaultStyles.message}
                aria-live="polite"
                aria-label="Checking WebXR compatibility"
              >
                Checking compatibility...
              </output>
            </div>
          </div>
        )}
      </>
    );
  }

  // Session active - show children
  if (started) {
    return <>{children}</>;
  }

  // Not supported or error
  if (!isSupported || error) {
    return (
      <>
        {fallback || (
          <div
            style={defaultStyles.container}
            className={className}
            role="alert"
            aria-live="assertive"
          >
            <div style={defaultStyles.card}>
              <h1 style={defaultStyles.title} id="xr-error-title">
                🚫 {title}
              </h1>
              <p style={defaultStyles.message} id="xr-error-message">
                {error || message}
              </p>
              {!hasRequestedModes && (
                <p
                  style={{ ...defaultStyles.tag, color: "orange" }}
                  role="note"
                  aria-label="Development warning"
                >
                  (Dev Warning: No start callbacks provided)
                </p>
              )}
            </div>
          </div>
        )}
      </>
    );
  }

  // Show mode selection
  return (
    <section
      style={defaultStyles.container}
      className={className}
      aria-labelledby="xr-welcome-title"
      aria-describedby="xr-welcome-message"
    >
      <div style={defaultStyles.card}>
        <h1 style={defaultStyles.title} id="xr-welcome-title">
          Welcome
        </h1>
        <p style={defaultStyles.message} id="xr-welcome-message">
          Select an experience mode:
        </p>
        <fieldset style={defaultStyles.buttonGroup} aria-label="XR mode selection">
          <legend style={{ display: "none" }}>XR mode selection</legend>
          {showVR && (
            <button
              type="button"
              style={defaultStyles.button}
              onClick={handleVRStart}
              aria-label="Start Virtual Reality experience"
            >
              Start VR
            </button>
          )}
          {showVR && showAR && <span style={{ width: "20px" }} aria-hidden="true" />}
          {showAR && (
            <button
              type="button"
              style={defaultStyles.button}
              onClick={handleARStart}
              aria-label="Start Augmented Reality experience"
            >
              Start AR
            </button>
          )}
        </fieldset>
      </div>
    </section>
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
    gap: "20px",
    border: "none",
    padding: 0,
    margin: 0,
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
