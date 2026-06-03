"use client";

import React, { Children, isValidElement, ReactNode } from "react";
import { LucideCheck, LucideChevronRight, LucideChevronLeft, LucideSparkles, LucideChevronsLeftRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface WizardTabsProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (id: string) => void;
  onComplete: () => void;
  completeButtonLabel?: ReactNode;
}

export const WizardTabs = ({
  children,
  activeTab,
  onTabChange,
  onComplete,
  completeButtonLabel,
}: WizardTabsProps) => {
  const tabs = Children.toArray(children).filter(isValidElement);
  const currentIndex = tabs.findIndex((tab: any) => tab.props.id === activeTab);
  const isCompletionStep = Boolean((tabs[currentIndex] as any)?.props?.completeStep);

  return (
    <div className="max-w-4xl w-full flex flex-col mx-auto">
      
      {/* --- Refined Stepper Header --- */}
      <div className="flex items-center justify-center mb-14 w-full">
        {tabs.map((tab: any, index: number) => {
          const isActive = index === currentIndex;
          const isCompleted = index < currentIndex;

          return (
            <React.Fragment key={tab.props.id}>
              <div className="flex flex-col items-center relative group">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isActive ? 1.1 : 1,
                    backgroundColor: isCompleted ? "#7c3aed" : "#ffffff",
                    borderColor: isActive || isCompleted ? "#7c3aed" : "#e2e8f0",
                  }}
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 z-10 shadow-sm transition-all duration-300 relative`}
                >
                  {isCompleted ? (
                    <LucideCheck className="w-6 h-6 text-white stroke-[3px]" />
                  ) : (
                    <span className={`text-base font-black ${isActive ? "text-purple-600" : "text-gray-400"}`}>
                      {index + 1}
                    </span>
                  )}

                 </motion.div>
                
                {/* Step Label with slight lift on active */}
                <span className={`absolute -bottom-8 text-[11px] font-black uppercase tracking-[0.15em] whitespace-nowrap transition-all duration-300 ${
                  isActive ? "text-purple-600 translate-y-[-2px]" : "text-gray-400"
                }`}>
                  {tab.props.label}
                </span>
              </div>

              {/* Connecting Line with Gradient Progress */}
              {index < tabs.length - 1 && (
                <div className="flex-1 max-w-[100px] h-[3px] mx-4 bg-gray-100 rounded-full overflow-hidden relative">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: isCompleted ? "100%" : "0%" }}
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-violet-400"
                    transition={{ duration: 0.5 }}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* --- Tab Content Area --- */}
      <div className="flex-1 min-h-75 bg-white/50 backdrop-blur-sm rounded-[2rem] relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="w-full h-full"
          >
            {tabs[currentIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* --- Modern Footer Navigation --- */}
      <div className=" pt-8 border-t border-purple-100 flex items-center justify-between">
        <button
          type="button"
          disabled={currentIndex === 0}
          onClick={() => onTabChange((tabs[currentIndex - 1] as any).props.id)}
          className={`group flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
            currentIndex === 0
              ? "opacity-0 pointer-events-none"
              : "text-gray-400 hover:text-purple-600 hover:bg-purple-50"
          }`}
        >
          <LucideChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" /> 
          Back
        </button>

        <button
          type="button"
          onClick={() =>
            isCompletionStep
              ? onComplete()
              : onTabChange((tabs[currentIndex + 1] as any).props.id)
          }
          className="group relative flex items-center gap-3 bg-purple-600 text-white px-10 py-4 rounded-2xl font-bold overflow-hidden shadow-xl shadow-purple-200 hover:bg-purple-700 active:scale-95 transition-all"
        >
          {/* Subtle Shine Effect on Button */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          
          <span className="tracking-wide relative z-10">
            {isCompletionStep ? completeButtonLabel : "Continue"}
          </span>
          
           
        </button>
      </div>
    </div>
  );
};

export const WizardTab = ({
  children,
}: {
  children: ReactNode;
  id: string;
  label: string;
  completeStep?: boolean;
}) => <div className="w-full h-full">{children}</div>;