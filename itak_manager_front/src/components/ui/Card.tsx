import { type ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
}

const Card = ({
  children,
  className = "",
  hover = true,
  delay = 0,
}: CardProps) => {
  return (
    <div
      className={`card bg-white shadow-lg hover:shadow-xl border border-slate-100 transition-all duration-300 ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;
