import { useRef, useEffect } from "react";

/**
 * Custom hook for 3D tilt effect on hover
 * Creates a parallax-like 3D rotation based on mouse position
 */
export const use3DTilt = (maxTilt = 15, perspective = 1000) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const percentX = (x - centerX) / centerX;
      const percentY = (y - centerY) / centerY;

      const tiltX = percentY * maxTilt;
      const tiltY = -percentX * maxTilt;

      element.style.transform = `perspective(${perspective}px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = () => {
      element.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    // Set initial transition
    element.style.transition = "transform 0.3s ease-out";
    element.style.transformStyle = "preserve-3d";

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [maxTilt, perspective]);

  return ref;
};
