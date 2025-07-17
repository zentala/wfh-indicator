import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  // Allows passing custom Tailwind/DaisyUI classes to the container
  containerClassName?: string;
}

/**
 * A reusable Input component with a label, based on DaisyUI form controls.
 * @param {InputProps} props The props for the input.
 * @returns {JSX.Element} A form control with a label and input.
 */
export const Input: React.FC<InputProps> = ({
  label,
  containerClassName = "",
  ...props
}) => {
  return (
    <div className={`form-control w-full ${containerClassName}`}>
      <label className="label">
        <span className="label-text">{label}</span>
      </label>
      <input type="text" className="input input-bordered w-full" {...props} />
    </div>
  );
};
