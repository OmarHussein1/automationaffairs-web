import type { ReactNode } from "react";
import { cn } from "../../lib/utils";

interface AnimatedBorderProps {
  children: ReactNode;
  isHovered: boolean;
  isFocused?: boolean;
  className?: string;
}

export function AnimatedBorder({
  children,
  isHovered,
  isFocused = false,
  className = "",
}: AnimatedBorderProps) {
  const isActive = isHovered || isFocused;

  return (
    <div
      className={cn(
        "relative rounded-2xl border transition-colors duration-300 bg-white dark:bg-black/90",
        isActive
          ? "border-primary dark:border-[#f3ff5a]"
          : "border-gray-200 dark:border-gray-200",
        className,
      )}
    >
      {children}
    </div>
  );
}
