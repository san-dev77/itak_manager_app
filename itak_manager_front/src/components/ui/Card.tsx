import { motion } from "framer-motion";
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
    <motion.div
      className={`card bg-white shadow-lg hover:shadow-xl border border-slate-100 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : {}}
    >
      {children}
    </motion.div>
  );
};

export default Card;
