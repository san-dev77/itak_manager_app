import { forwardRef, type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = "", ...props }, ref) => {
    return (
      <div className="form-control w-full">
        {label && (
          <label className="label">
            <span className="label-text text-slate-700 font-medium">
              {label}
            </span>
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              input input-bordered w-full bg-white text-slate-800 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200
              transition-all duration-200 placeholder:text-slate-400
              ${icon ? "pl-10" : ""}
              ${
                error
                  ? "border-red-400 focus:border-red-500 focus:ring-red-200"
                  : ""
              }
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <div className="label">
            <span className="label-text-alt text-red-500">{error}</span>
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
