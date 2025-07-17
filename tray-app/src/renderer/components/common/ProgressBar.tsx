import React from "react";

interface ProgressBarProps {
  value: number;
  max?: number;
  // Allows passing custom Tailwind/DaisyUI classes
  className?: string;
}

/**
 * A reusable progress bar component from DaisyUI, ideal for battery indicators.
 * @param {ProgressBarProps} props The props for the progress bar.
 * @returns {JSX.Element} A progress element.
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  className = "",
}) => {
  return (
    <progress
      className={`progress progress-primary ${className}`}
      value={value}
      max={max}
    ></progress>
  );
};
