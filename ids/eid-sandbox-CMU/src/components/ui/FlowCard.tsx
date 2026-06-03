import { ReactNode } from 'react';
import { LucideLoader2, LucideAlertCircle } from 'lucide-react';

interface FlowCardProps {
  title: string | ReactNode;
  children: ReactNode;
  loading?: boolean;
  error?: any;
}

export const FlowCard = ({ title, children, loading, error }: FlowCardProps) => {
  return (
    <div className="relative overflow-hidden bg-white border border-gray-100 rounded-3xl shadow-xl shadow-purple-100/50 transition-all duration-300 hover:shadow-purple-200/60">
      {/* Accent Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-400 via-purple-600 to-purple-400" />
      
      <div className="p-8">
        <div className="mb-6 pb-4 border-b border-gray-50">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            {title}
          </h2>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 animate-in fade-in zoom-in-95">
            <LucideAlertCircle className="w-5 h-5 flex-shrink-0" />
            <div className="text-sm font-medium">
              <span className="font-bold">Request Failed:</span> {error.message || "Unknown error occurred"}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <LucideLoader2 className="w-12 h-12 text-purple-600 animate-spin" />
            <p className="text-sm font-medium text-gray-500 animate-pulse">Processing request...</p>
          </div>
        ) : (
          <div className="min-h-[400px] flex flex-col">{children}</div>
        )}
      </div>
    </div>
  );
};