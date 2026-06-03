"use client";

import React from "react";
import { motion } from "framer-motion";

interface ActionCardProps {
  label: string;
  icon: React.ReactNode;
  bg: string;
  onClick: () => void;
}

export const ActionCard: React.FC<ActionCardProps> = ({
  label,
  icon,
  bg,
  onClick,
}) => {
  return (
    <motion.div
      onClick={onClick}
      role="button"
      tabIndex={0}
      whileHover={{
        y: -4,
        boxShadow: "0px 12px 30px rgba(124, 58, 237, 0.15)",
      }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 300, damping: 22 }}
      className="
        w-full
        bg-white
        border border-gray-200
        rounded-xl
        px-4 py-4
        flex flex-col
        gap-3
        cursor-pointer
        select-none

        min-h-30
        sm:min-h-32.5

        hover:border-purple-200
        focus:outline-none
        focus:ring-2
        focus:ring-purple-400
        focus:ring-offset-2
      "
    >
      {/* Icon */}
      <div
        className="
          w-11 h-11
          rounded-lg
          flex items-center justify-center
          shrink-0
        "
        style={{ backgroundColor: bg }}
      >
        {icon}
      </div>

      {/* Label */}
      <p
        className="
          text-sm
          font-medium
          text-gray-900
          leading-snug
          wrap-break-word
          line-clamp-2
        "
      >
        {label}
      </p>
    </motion.div>
  );
};
