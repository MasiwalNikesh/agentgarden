import { useRef, useEffect } from "react";

/**
 * Custom hook for magnetic cursor effect
 * Elements will be attracted to the cursor when hovering nearby
 */
export const useMagneticEffect = (strength = 0.3) => {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;

      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
      const maxDistance = 200; // Maximum distance for effect

      if (distance < maxDistance) {
        const pull = 1 - distance / maxDistance;
        const x = deltaX * strength * pull;
        const y = deltaY * strength * pull;

        element.style.transform = `translate(${x}px, ${y}px)`;
      }
    };

    const handleMouseLeave = () => {
      element.style.transform = "translate(0px, 0px)";
    };

    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [strength]);

  return ref;
};
