
import React, { useEffect, useState } from "react";
import { getScaleClasses } from "@/lib/animations";

interface ScaleInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  once?: boolean;
  className?: string;
  state?: "visible" | "hidden";
}

export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  className,
  delay = 0,
  duration = 500,
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
      className={getScaleClasses({
        state: isVisible ? "visible" : "hidden",
        className,
      })}
      style={{ transitionDuration: `${duration}ms` }}
    >
      {children}
    </div>
  );
};
