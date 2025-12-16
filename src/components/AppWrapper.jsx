import React, { useMemo, useState, useEffect } from "react";
import "./AppWrapper.css";

// Base design dimensions (laptop/desktop)
const BASE_WIDTH = 1440;   // design width (laptop)
const BASE_HEIGHT = 900;   // design height (laptop)

// Convert mm to px (using 96 DPI: 1 inch = 25.4 mm, 1 inch = 96 px)
// Target device: 131.5mm (height) × 64.2mm (width) × 7.65mm (depth)
const MM_TO_PX = 96 / 25.4;
const TARGET_WIDTH = 64.2 * MM_TO_PX;   // ≈ 242.65 px
const TARGET_HEIGHT = 131.5 * MM_TO_PX;  // ≈ 496.63 px

export default function AppWrapper({ children }) {
  const [shouldScale, setShouldScale] = useState(false);

  useEffect(() => {
    // Disable scaling for regular mobile phones - use responsive CSS instead
    // Only apply scaling for very specific device dimensions if needed
    const checkDevice = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      // Disable scaling - let CSS handle responsiveness
      setShouldScale(false);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  const { scale, offsetX, offsetY } = useMemo(() => {
    if (!shouldScale) {
      return { scale: 1, offsetX: 0, offsetY: 0 };
    }

    // Calculate scale to fit while preserving aspect ratio
    const scaleX = TARGET_WIDTH / BASE_WIDTH;
    const scaleY = TARGET_HEIGHT / BASE_HEIGHT;
    const scale = Math.min(scaleX, scaleY); // preserve aspect ratio

    // Calculate scaled dimensions
    const scaledWidth = BASE_WIDTH * scale;
    const scaledHeight = BASE_HEIGHT * scale;

    // Center inside the physical frame
    const offsetX = (TARGET_WIDTH - scaledWidth) / 2;
    const offsetY = (TARGET_HEIGHT - scaledHeight) / 2;

    return { scale, offsetX, offsetY };
  }, [shouldScale]);

  if (!shouldScale) {
    // On larger screens, render normally without scaling
    return <div className="app-normal">{children}</div>;
  }

  return (
    <div
      className="device-frame"
      style={{
        width: `${TARGET_WIDTH}px`,
        height: `${TARGET_HEIGHT}px`,
      }}
    >
      <div
        className="app-scaled"
        style={{
          width: `${BASE_WIDTH}px`,
          height: `${BASE_HEIGHT}px`,
          transform: `translate(${offsetX}px, ${offsetY}px) scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {children}
      </div>
    </div>
  );
}

