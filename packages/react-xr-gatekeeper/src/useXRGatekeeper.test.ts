import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { useXRGatekeeper } from "./useXRGatekeeper";

// Mock navigator.xr
const mockXR = {
  isSessionSupported: vi.fn(),
};

describe("useXRGatekeeper", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Reset navigator.xr
    Object.defineProperty(navigator, "xr", {
      value: undefined,
      writable: true,
      configurable: true,
    });
    vi.restoreAllMocks();
  });

  it("should return checking state initially", () => {
    // Set up navigator.xr to delay the check before renderHook
    Object.defineProperty(navigator, "xr", {
      value: {
        isSessionSupported: vi.fn(() => new Promise(() => {})), // Never resolves
      },
      writable: true,
      configurable: true,
    });

    const { result } = renderHook(() => useXRGatekeeper());
    // Initially, isChecking should be true
    expect(result.current.isChecking).toBe(true);
    expect(result.current.isVRSupported).toBe(false);
    expect(result.current.isARSupported).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should detect when WebXR is not available", async () => {
    const { result } = renderHook(() => useXRGatekeeper());

    await waitFor(() => {
      expect(result.current.isChecking).toBe(false);
    });

    expect(result.current.isVRSupported).toBe(false);
    expect(result.current.isARSupported).toBe(false);
    expect(result.current.error).toBe("WebXR is not supported in this browser");
  });

  it("should detect VR support", async () => {
    Object.defineProperty(navigator, "xr", {
      value: mockXR,
      writable: true,
      configurable: true,
    });

    mockXR.isSessionSupported.mockImplementation((mode: string) => {
      if (mode === "immersive-vr") {
        return Promise.resolve(true);
      }
      if (mode === "immersive-ar") {
        return Promise.resolve(false);
      }
      return Promise.resolve(false);
    });

    const { result } = renderHook(() => useXRGatekeeper());

    await waitFor(() => {
      expect(result.current.isChecking).toBe(false);
    });

    expect(result.current.isVRSupported).toBe(true);
    expect(result.current.isARSupported).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("should detect AR support", async () => {
    Object.defineProperty(navigator, "xr", {
      value: mockXR,
      writable: true,
      configurable: true,
    });

    mockXR.isSessionSupported.mockImplementation((mode: string) => {
      if (mode === "immersive-vr") {
        return Promise.resolve(false);
      }
      if (mode === "immersive-ar") {
        return Promise.resolve(true);
      }
      return Promise.resolve(false);
    });

    const { result } = renderHook(() => useXRGatekeeper());

    await waitFor(() => {
      expect(result.current.isChecking).toBe(false);
    });

    expect(result.current.isVRSupported).toBe(false);
    expect(result.current.isARSupported).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("should handle errors gracefully", async () => {
    Object.defineProperty(navigator, "xr", {
      value: mockXR,
      writable: true,
      configurable: true,
    });

    const testError = new Error("Test error");
    mockXR.isSessionSupported.mockRejectedValue(testError);

    const { result } = renderHook(() => useXRGatekeeper());

    await waitFor(() => {
      expect(result.current.isChecking).toBe(false);
    });

    expect(result.current.isVRSupported).toBe(false);
    expect(result.current.isARSupported).toBe(false);
    expect(result.current.error).toContain("Test error");
  });
});
