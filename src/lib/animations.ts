
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "./utils";

export const fadeAnimation = cva("transition-opacity duration-500", {
  variants: {
    state: {
      hidden: "opacity-0",
      visible: "opacity-100",
    },
    direction: {
      up: "translate-y-4",
      down: "translate-y-[-1rem]",
      left: "translate-x-4",
      right: "translate-x-[-1rem]",
      none: "",
    },
  },
  defaultVariants: {
    state: "hidden",
    direction: "none",
  },
});

export const slideAnimation = cva("transition-transform duration-500", {
  variants: {
    state: {
      hidden: "translate-y-8 opacity-0",
      visible: "translate-y-0 opacity-100",
    },
    direction: {
      up: "translate-y-8",
      down: "translate-y-[-2rem]",
      left: "translate-x-8",
      right: "translate-x-[-2rem]",
    },
    delay: {
      none: "delay-0",
      short: "delay-100",
      medium: "delay-200",
      long: "delay-300",
      longer: "delay-500",
    },
  },
  defaultVariants: {
    state: "hidden",
    direction: "up",
    delay: "none",
  },
});

export const scaleAnimation = cva("transition-transform duration-500", {
  variants: {
    state: {
      hidden: "scale-95 opacity-0",
      visible: "scale-100 opacity-100",
    },
    delay: {
      none: "delay-0",
      short: "delay-100",
      medium: "delay-200",
      long: "delay-300",
    },
  },
  defaultVariants: {
    state: "hidden",
    delay: "none",
  },
});

export interface FadeProps extends VariantProps<typeof fadeAnimation> {
  className?: string;
}

export interface SlideProps extends VariantProps<typeof slideAnimation> {
  className?: string;
}

export interface ScaleProps extends VariantProps<typeof scaleAnimation> {
  className?: string;
}

export function getFadeClasses({ state, direction, className }: FadeProps) {
  return cn(fadeAnimation({ state, direction }), className);
}

export function getSlideClasses({ state, direction, delay, className }: SlideProps) {
  return cn(slideAnimation({ state, direction, delay }), className);
}

export function getScaleClasses({ state, delay, className }: ScaleProps) {
  return cn(scaleAnimation({ state, delay }), className);
}
