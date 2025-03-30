
import React, { useEffect, useState } from "react";
import { FadeProps, getFadeClasses } from "@/lib/animations";

interface FadeInProps extends FadeProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  once?: boolean;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  className,
  direction = "none",
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
      className={getFadeClasses({
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
