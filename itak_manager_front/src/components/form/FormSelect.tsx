import { forwardRef } from "react";
import type { FieldError } from "react-hook-form";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: FieldError;
  options: Option[];
  placeholder?: string;
}

const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  ({ label, error, options, placeholder = "Sélectionner", className = "", ...props }, ref) => {
    return (
      <div className="space-y-1">
        {label && (
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
            {label}
          </label>
        )}
        <select
          ref={ref}
          className={`
            w-full px-3 py-2.5 text-sm font-medium
            bg-white border-2 rounded-lg transition-all duration-200
            ${error ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-blue-500"}
            focus:outline-none focus:ring-2 focus:ring-blue-500/20
            ${className}
          `}
          {...props}
        >
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-xs text-red-500 font-medium">{error.message}</p>
        )}
      </div>
    );
  }
);

FormSelect.displayName = "FormSelect";

export default FormSelect;

