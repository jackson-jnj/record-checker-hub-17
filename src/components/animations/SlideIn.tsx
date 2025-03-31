
import React, { useEffect, useState } from "react";
import { getSlideClasses } from "@/lib/animations";

interface SlideInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: "left" | "right" | "up" | "down";
  once?: boolean;
  className?: string;
  state?: "visible" | "hidden";
}

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  className,
  delay = 0,
  duration = 500,
  direction = "left",
  once = true,
  state: initialState,
}) => {
  const [isVisible, setIsVisible] = useState(initialState === "visible");

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={getSlideClasses({
        state: isVisible ? "visible" : "hidden",
        direction,
        className,
      })}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
};
