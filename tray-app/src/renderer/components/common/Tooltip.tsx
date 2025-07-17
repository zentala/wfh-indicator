import React from "react";

interface TooltipProps {
  // The text content of the tooltip
  tip: string;
  // The element the tooltip is for
  children: React.ReactNode;
  // DaisyUI tooltip position
  position?: "top" | "bottom" | "left" | "right";
  className?: string;
}

/**
 * A reusable Tooltip component wrapping DaisyUI's tooltip styles.
 * @param {TooltipProps} props The props for the tooltip.
 * @returns {JSX.Element} A tooltip container.
 */
export const Tooltip: React.FC<TooltipProps> = ({
  tip,
  children,
  position = "top",
  className = "",
}) => {
  const positionClass = `tooltip-${position}`;
  return (
    <div className={`tooltip ${positionClass} ${className}`} data-tip={tip}>
      {children}
    </div>
  );
};
