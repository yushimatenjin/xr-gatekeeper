import { useEffect, useState } from "react";

interface XRSystem {
  isSessionSupported(mode: string): Promise<boolean>;
}

interface NavigatorWithXR extends Navigator {
  xr?: XRSystem;
}

export function useXRGatekeeper() {
  const [isVRSupported, setIsVRSupported] = useState<boolean>(false);
  const [isARSupported, setIsARSupported] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(true);

  useEffect(() => {
    const nav = navigator as NavigatorWithXR;

    if (!nav.xr) {
      setIsVRSupported(false);
      setIsARSupported(false);
      setIsChecking(false);
      return;
    }

    const checkVR = nav.xr.isSessionSupported("immersive-vr");
    const checkAR = nav.xr.isSessionSupported("immersive-ar");

    Promise.all([checkVR, checkAR])
      .then(([vrSupported, arSupported]) => {
        setIsVRSupported(vrSupported);
        setIsARSupported(arSupported);
      })
      .catch((err) => {
        console.error("WebXR check failed:", err);
        setIsVRSupported(false);
        setIsARSupported(false);
      })
      .finally(() => {
        setIsChecking(false);
      });
  }, []);

  return { isVRSupported, isARSupported, isChecking };
}
