'use client';

 import { StatCard } from "@/components/ui/statCard";
import { FileText, ShieldCheck } from "lucide-react";
 
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from "recharts";
export default function IssuerDashboard() {
  const issuanceData = [
  { name: "Jan", total: 40 },
  { name: "Feb", total: 30 },
  { name: "Mar", total: 55 },
  { name: "Apr", total: 27 },
  { name: "May", total: 48 },
  { name: "Jun", total: 73 },
];
  return (
    <div className="-m-6 flex w-[calc(100%+48px)] min-h-screen text-black/80 bg-white">
      <div className="flex-1 flex flex-col">
        <main className="flex-1 px-6 py-6 bg-white">
 
          {/* STAT CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total Credentials Issued"
              value={5}
              bg="#EEF2FF"
              icon={<FileText size={20} className="text-[#5B18EB]" />}
            />
            <StatCard
              label="Total micro Credentials issued"
              value={5}
              bg="#FFF7ED"
              icon={<FileText size={20} className="text-[#EA580C]" />}
            />
            <StatCard
              label="Total credentials verified"
              value={5}
              bg="#ECFDF5"
              icon={<ShieldCheck size={20} className="text-[#16A34A]" />}
            />
            <StatCard
              label="Total revenue from verification"
              value={5}
              bg="#F5F3FF"
              icon={<ShieldCheck size={20} className="text-[#7C3AED]" />}
            />
          </div>

           <div className="grid grid-cols-1 mt-6 lg:grid-cols-3 gap-10">
        
        {/* Main Chart Card */}
        <div className="lg:col-span-2  bg-white/70 backdrop-blur-xl p-8 rounded-[3rem] border border-slate-100 shadow-xl shadow-gray-200/50">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-xl font-black text-gray-900 tracking-tight">System Velocity</h3>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Real-time Data Stream</p>
            </div>
            <div className="flex gap-2">
              <span className="h-3 w-3 bg-indigo-500 rounded-full animate-pulse" />
              <span className="h-3 w-3 bg-gray-200 rounded-full" />
            </div>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={issuanceData}>
                <defs>
                  <linearGradient id="mainGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={15} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                <Tooltip 
                  contentStyle={{
                    borderRadius: '24px', 
                    border: 'none', 
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    padding: '12px 20px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#4f46e5" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#mainGradient)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Circular Progress / Distribution */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-[3rem] shadow-2xl text-black flex flex-col justify-between overflow-hidden relative">
          {/* Abstract background shape */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[60px] rounded-full" />
          
          <div>
            <h3 className="text-lg font-bold mb-1">Network Health</h3>
            <p className="text-gray-400 text-xs font-medium">Global verification status</p>
          </div>

          <div className="py-10 flex justify-center relative">
             <div className="w-44 h-44 rounded-full border-[16px] border-white/5 flex items-center justify-center">
                <div className="w-44 h-44 rounded-full border-[16px] border-t-purple-500 border-r-indigo-500 border-b-transparent border-l-transparent absolute rotate-45 shadow-[0_0_20px_rgba(168,85,247,0.4)]" />
                <div className="text-center">
                   <span className="text-4xl font-black block leading-none tracking-tighter">98.2</span>
                   <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Efficiency</span>
                </div>
             </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-xs font-bold text-gray-800">Active Nodes</span>
               </div>
               <span className="text-xs font-black ">142</span>
            </div>
            <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
               <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 w-[85%]" />
            </div>
          </div>
        </div>

      </div>
 
        </main>
      </div>
    </div>
  );
}
