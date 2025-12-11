import { forwardRef } from "react";
import type { FieldError } from "react-hook-form";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: FieldError;
  icon?: React.ReactNode;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, icon, className = "", type = "text", ...props }, ref) => {
    const isDate = type === "date";
    
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            type={type}
            className={`
              w-full px-3 py-2.5 text-sm font-medium
              border-2 rounded-lg transition-all duration-200
              ${isDate ? "bg-slate-800 text-white border-slate-700 [color-scheme:dark]" : "bg-white text-slate-800 border-slate-200"}
              ${error ? "border-red-400 focus:border-red-500 focus:ring-red-500/20" : "focus:border-blue-500 focus:ring-blue-500/20"}
              focus:outline-none focus:ring-2
              placeholder:text-slate-400 placeholder:font-normal
              ${icon ? "pl-10" : ""}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="text-xs text-red-500 font-medium">{error.message}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export default FormInput;

