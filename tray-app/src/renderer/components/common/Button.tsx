import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  // Allows passing custom Tailwind/DaisyUI classes
  className?: string;
  // DaisyUI button variants
  variant?: "primary" | "secondary" | "accent" | "ghost" | "link";
}

/**
 * A reusable Button component wrapping DaisyUI's button styles.
 * @param {ButtonProps} props The props for the button.
 * @returns {JSX.Element} A button element.
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  variant = "primary",
  ...props
}) => {
  const daisyClass = `btn-${variant}`;
  return (
    <button className={`btn ${daisyClass} ${className}`} {...props}>
      {children}
    </button>
  );
};
