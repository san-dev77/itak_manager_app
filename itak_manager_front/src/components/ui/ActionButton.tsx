import { type LucideIcon, Plus } from "lucide-react";

interface ActionButtonProps {
  onClick: () => void;
  icon?: LucideIcon;
  label: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

const ActionButton = ({
  onClick,
  icon: Icon = Plus,
  label,
  variant = "primary",
  size = "md",
  disabled = false,
  loading = false,
  className = "",
}: ActionButtonProps) => {
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40",
    secondary: "bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm",
    ghost: "bg-transparent hover:bg-slate-100 text-slate-600",
    danger: "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm gap-1.5",
    md: "px-4 py-2.5 text-sm gap-2",
    lg: "px-6 py-3 text-base gap-2.5",
  };

  const iconSizes = {
    sm: "w-3.5 h-3.5",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200
        ${variants[variant]}
        ${sizes[size]}
        ${disabled || loading ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
    >
      {loading ? (
        <div className={`${iconSizes[size]} border-2 border-current/30 border-t-current rounded-full animate-spin`} />
      ) : (
        <Icon className={iconSizes[size]} />
      )}
      <span>{label}</span>
    </button>
  );
};

// Bouton pour header avec style blanc sur fond coloré
export const HeaderActionButton = ({
  onClick,
  icon: Icon = Plus,
  label,
  disabled = false,
}: {
  onClick: () => void;
  icon?: LucideIcon;
  label: string;
  disabled?: boolean;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="flex items-center gap-2 px-5 py-2.5 bg-white text-slate-800 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <Icon className="w-4 h-4" />
    <span>{label}</span>
  </button>
);

export default ActionButton;

