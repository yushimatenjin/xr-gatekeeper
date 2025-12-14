import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { XRGatekeeper } from "./XRGatekeeper";
import * as useXRGatekeeperModule from "./useXRGatekeeper";

describe("XRGatekeeper", () => {
  const mockUseXRGatekeeper = vi.spyOn(useXRGatekeeperModule, "useXRGatekeeper");

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show loading state", () => {
    mockUseXRGatekeeper.mockReturnValue({
      isVRSupported: false,
      isARSupported: false,
      isChecking: true,
      error: null,
    });

    render(
      <XRGatekeeper onVRStart={() => {}}>
        <div>Content</div>
      </XRGatekeeper>
    );

    expect(screen.getByText("Checking compatibility...")).toBeInTheDocument();
  });

  it("should show custom loading component", () => {
    mockUseXRGatekeeper.mockReturnValue({
      isVRSupported: false,
      isARSupported: false,
      isChecking: true,
      error: null,
    });

    render(
      <XRGatekeeper loading={<div>Custom loading...</div>} onVRStart={() => {}}>
        <div>Content</div>
      </XRGatekeeper>
    );

    expect(screen.getByText("Custom loading...")).toBeInTheDocument();
  });

  it("should show error when XR is not supported", async () => {
    mockUseXRGatekeeper.mockReturnValue({
      isVRSupported: false,
      isARSupported: false,
      isChecking: false,
      error: "WebXR is not supported",
    });

    render(
      <XRGatekeeper onVRStart={() => {}}>
        <div>Content</div>
      </XRGatekeeper>
    );

    await waitFor(() => {
      expect(screen.getByText(/Device Not Compatible/)).toBeInTheDocument();
    });
    expect(screen.getByText("WebXR is not supported")).toBeInTheDocument();
  });

  it("should show VR button when VR is supported", async () => {
    mockUseXRGatekeeper.mockReturnValue({
      isVRSupported: true,
      isARSupported: false,
      isChecking: false,
      error: null,
    });

    const onVRStart = vi.fn();

    render(
      <XRGatekeeper onVRStart={onVRStart}>
        <div>Content</div>
      </XRGatekeeper>
    );

    await waitFor(() => {
      expect(screen.getByText("Start VR")).toBeInTheDocument();
    });

    const button = screen.getByLabelText("Start Virtual Reality experience");
    await userEvent.click(button);

    expect(onVRStart).toHaveBeenCalledTimes(1);
  });

  it("should show AR button when AR is supported", async () => {
    mockUseXRGatekeeper.mockReturnValue({
      isVRSupported: false,
      isARSupported: true,
      isChecking: false,
      error: null,
    });

    const onARStart = vi.fn();

    render(
      <XRGatekeeper onARStart={onARStart}>
        <div>Content</div>
      </XRGatekeeper>
    );

    await waitFor(() => {
      expect(screen.getByText("Start AR")).toBeInTheDocument();
    });

    const button = screen.getByLabelText("Start Augmented Reality experience");
    await userEvent.click(button);

    expect(onARStart).toHaveBeenCalledTimes(1);
  });

  it("should show children when session is started", async () => {
    mockUseXRGatekeeper.mockReturnValue({
      isVRSupported: true,
      isARSupported: false,
      isChecking: false,
      error: null,
    });

    const onVRStart = vi.fn();

    const { rerender } = render(
      <XRGatekeeper onVRStart={onVRStart}>
        <div>XR Content</div>
      </XRGatekeeper>
    );

    const button = screen.getByLabelText("Start Virtual Reality experience");
    await userEvent.click(button);

    rerender(
      <XRGatekeeper onVRStart={onVRStart}>
        <div>XR Content</div>
      </XRGatekeeper>
    );

    await waitFor(() => {
      expect(screen.getByText("XR Content")).toBeInTheDocument();
    });
  });

  it("should show custom fallback", () => {
    mockUseXRGatekeeper.mockReturnValue({
      isVRSupported: false,
      isARSupported: false,
      isChecking: false,
      error: "Not supported",
    });

    render(
      <XRGatekeeper fallback={<div>Custom fallback</div>} onVRStart={() => {}}>
        <div>Content</div>
      </XRGatekeeper>
    );

    expect(screen.getByText("Custom fallback")).toBeInTheDocument();
  });

  it("should have proper accessibility attributes", async () => {
    mockUseXRGatekeeper.mockReturnValue({
      isVRSupported: true,
      isARSupported: false,
      isChecking: false,
      error: null,
    });

    render(
      <XRGatekeeper onVRStart={() => {}}>
        <div>Content</div>
      </XRGatekeeper>
    );

    await waitFor(() => {
      const section = screen.getByRole("region", { name: /welcome/i });
      expect(section).toHaveAttribute("aria-labelledby", "xr-welcome-title");
      expect(section).toHaveAttribute("aria-describedby", "xr-welcome-message");
    });
  });
});
