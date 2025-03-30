
import React, { useEffect, useState } from "react";
import { SlideProps, getSlideClasses } from "@/lib/animations";

interface SlideInProps extends SlideProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  once?: boolean;
}

export const SlideIn: React.FC<SlideInProps> = ({
  children,
  className,
  direction = "up",
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
