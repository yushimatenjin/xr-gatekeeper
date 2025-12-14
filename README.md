# WebXR Gatekeeper

A React library for gating content based on WebXR support. This library provides components and hooks to check for WebXR (VR/AR) compatibility and conditionally render content.

## Features

- ✅ Check WebXR support (VR and AR)
- ✅ React hook (`useXRGatekeeper`) for programmatic access
- ✅ React component (`XRGatekeeper`) for declarative usage
- ✅ Full TypeScript support
- ✅ Accessible (a11y) by default
- ✅ Customizable UI
- ✅ Error handling
- ✅ Comprehensive test coverage

## Installation

```bash
pnpm add react-xr-gatekeeper
```

## Quick Start

### Using the Component

```tsx
import { XRGatekeeper } from "react-xr-gatekeeper";

function App() {
  const startVR = () => {
    // Start your VR session
    console.log("VR session started");
  };

  const startAR = () => {
    // Start your AR session
    console.log("AR session started");
  };

  return (
    <XRGatekeeper
      onVRStart={startVR}
      onARStart={startAR}
      title="WebXR Required"
      message="Please use a WebXR-compatible device"
    >
      <YourXRContent />
    </XRGatekeeper>
  );
}
```

### Using the Hook

```tsx
import { useXRGatekeeper } from "react-xr-gatekeeper";

function MyComponent() {
  const { isVRSupported, isARSupported, isChecking, error } = useXRGatekeeper();

  if (isChecking) {
    return <div>Checking WebXR support...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (isVRSupported) {
    return <button onClick={startVR}>Start VR</button>;
  }

  return <div>WebXR not supported</div>;
}
```

## API Reference

### `XRGatekeeper` Component

Props:

- `children` (ReactNode): Content to display when XR session is active
- `fallback?` (ReactNode): Custom fallback UI when XR is not supported
- `loading?` (ReactNode): Custom loading UI while checking XR support
- `title?` (string): Title text for the error message (default: "Device Not Compatible")
- `message?` (string): Error message text (default: "This experience requires a WebXR compatible device/browser.")
- `onVRStart?` (() => void): Callback when VR session starts
- `onARStart?` (() => void): Callback when AR session starts
- `className?` (string): Custom CSS class name for the container

### `useXRGatekeeper` Hook

Returns an object with:

- `isVRSupported` (boolean): Whether VR (immersive-vr) is supported
- `isARSupported` (boolean): Whether AR (immersive-ar) is supported
- `isChecking` (boolean): Whether the check is currently in progress
- `error` (string | null): Error message if the check failed

## Development

This is a monorepo using pnpm workspaces with [pnpm catalog](https://pnpm.io/catalog) for One Version Rule.

### Setup

```bash
pnpm install
```

### Build

```bash
pnpm build
```

### Test

```bash
pnpm test
```

### Lint

```bash
pnpm lint
```

### Format

```bash
pnpm format
```

## Project Structure

```
.
├── packages/
│   ├── react-xr-gatekeeper/  # Main library package
│   └── examples/              # Example application
├── package.json              # Root package.json with pnpm catalog
└── pnpm-workspace.yaml       # pnpm workspace configuration
```

## Browser Support

This library requires browsers that support the [WebXR API](https://www.w3.org/TR/webxr/):

- Chrome/Edge 79+ (with WebXR flags enabled)
- Firefox Reality
- Oculus Browser
- Samsung Internet

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
