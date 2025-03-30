
import React, { useEffect, useState } from "react";
import { ScaleProps, getScaleClasses } from "@/lib/animations";

interface ScaleInProps extends ScaleProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  once?: boolean;
}

export const ScaleIn: React.FC<ScaleInProps> = ({
  children,
  className,
  delay = 0,
  duration = 500,
  once = true,
}) => {
  const [isVisible, setIsVisible] = useState(false);

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
