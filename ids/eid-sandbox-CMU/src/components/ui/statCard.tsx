import { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: number;
  bg: string;
  icon: ReactNode;
};

export function StatCard({ label, value, bg, icon }: StatCardProps) {
  return (
    <div className="h-22.5 bg-white border border-[#E5E7EB] rounded-lg px-4 flex items-center gap-3">
      <div className="flex flex-col ">
        <div
          className="w-10 h-10 rounded-md flex items-center justify-center"
          style={{ backgroundColor: bg }}
        >
          {icon}
        </div>
        <span className="text-[7px] text-gray-400 mt-1"> Current year</span>
      </div>

      <div>
        <p className="text-sm font-medium text-black">{label}</p>
        <p className="text-2xl font-bold text-black">{value}</p>
      </div>
    </div>
  );
}
