import { useEffect, useState, useCallback } from "react";

/**
 * WebXR support status
 */
export interface XRSupportStatus {
  /** Whether VR (immersive-vr) is supported */
  isVRSupported: boolean;
  /** Whether AR (immersive-ar) is supported */
  isARSupported: boolean;
  /** Whether the check is currently in progress */
  isChecking: boolean;
  /** Error message if the check failed */
  error: string | null;
}

/**
 * Custom hook to check WebXR support for VR and AR modes.
 *
 * @returns {XRSupportStatus} Object containing support status and error information
 *
 * @example
 * ```tsx
 * const { isVRSupported, isARSupported, isChecking, error } = useXRGatekeeper();
 *
 * if (isChecking) {
 *   return <div>Checking WebXR support...</div>;
 * }
 *
 * if (error) {
 *   return <div>Error: {error}</div>;
 * }
 * ```
 */
export function useXRGatekeeper(): XRSupportStatus {
  const [isVRSupported, setIsVRSupported] = useState<boolean>(false);
  const [isARSupported, setIsARSupported] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const checkXRSupport = useCallback(async () => {
    try {
      // Check if WebXR is available
      if (!navigator.xr) {
        setIsVRSupported(false);
        setIsARSupported(false);
        setIsChecking(false);
        setError("WebXR is not supported in this browser");
        return;
      }

      // Check both VR and AR support in parallel
      const [vrSupported, arSupported] = await Promise.all([
        navigator.xr.isSessionSupported("immersive-vr"),
        navigator.xr.isSessionSupported("immersive-ar"),
      ]);

      setIsVRSupported(vrSupported);
      setIsARSupported(arSupported);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      console.error("WebXR check failed:", err);
      setIsVRSupported(false);
      setIsARSupported(false);
      setError(`WebXR check failed: ${errorMessage}`);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    checkXRSupport();
  }, [checkXRSupport]);

  return { isVRSupported, isARSupported, isChecking, error };
}
