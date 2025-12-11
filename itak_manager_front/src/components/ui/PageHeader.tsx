import { type ReactNode } from "react";
import { type LucideIcon } from "lucide-react";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
  iconColor?: string;
  actions?: ReactNode;
}

const PageHeader = ({
  title,
  subtitle,
  icon: Icon,
  iconColor = "from-blue-600 to-blue-800",
  actions,
}: PageHeaderProps) => {
  return (
    <div className={`bg-gradient-to-r ${iconColor} rounded-2xl p-8 text-white relative overflow-hidden shadow-lg`}>
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/5 rounded-full" />

      <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-5">
          {Icon && (
            <div className="w-14 h-14 bg-white/25 backdrop-blur rounded-xl flex items-center justify-center shadow-inner">
              <Icon className="w-7 h-7 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{title}</h1>
            {subtitle && <p className="text-white/80 text-sm mt-1.5 font-medium">{subtitle}</p>}
          </div>
        </div>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  );
};

export default PageHeader;

