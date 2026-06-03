"use client";

import React from "react";
import { motion } from "framer-motion";
import { Construction } from "lucide-react";

export default function FeatureComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden relative">
      {/* Background Tech Detail */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} 
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center text-center p-8"
      >
        {/* Animated Icon Container */}
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-purple-100 rounded-3xl blur-xl opacity-50 animate-pulse" />
          <div className="relative h-16 w-16 bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-2xl flex items-center justify-center shadow-sm">
            <Construction size={28} className="text-purple-600" />
          </div>
        </div>

        {/* Text Content */}
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
          Coming Soon
        </h3>
        <p className="text-gray-500 text-sm max-w-[280px] font-medium leading-relaxed">
          This feature is currently under development to provide you with the best SSI experience.
        </p>

        {/* Minimal Progress Bar */}
        <div className="mt-8 w-48 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "70%" }}
            transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
          />
        </div>
      </motion.div>
    </div>
  );
}