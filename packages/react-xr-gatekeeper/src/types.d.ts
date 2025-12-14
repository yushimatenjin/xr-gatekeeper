/**
 * Type definitions for WebXR API
 * These types extend the standard Navigator interface to include WebXR support
 * @see https://www.w3.org/TR/webxr/
 */

type XRSessionMode = "inline" | "immersive-vr" | "immersive-ar";

interface XRSystem {
  /**
   * Check if a specific XR session mode is supported
   * @param mode - The XR session mode to check (e.g., "immersive-vr", "immersive-ar")
   * @returns Promise that resolves to true if the mode is supported
   */
  isSessionSupported(mode: XRSessionMode): Promise<boolean>;
}

interface Navigator {
  /**
   * WebXR API entry point
   * @see https://www.w3.org/TR/webxr/#navigator-xr-attribute
   */
  xr?: XRSystem;
}
