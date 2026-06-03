import { useState } from "react";
import { LucideCopy, LucideCheck, LucideShieldCheck } from "lucide-react";

export const QRCodeDisplay = ({ qrData, url }: { qrData: string; url: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
console.log("QR Data:", qrData);
console.log("URL:", url);
  return (
    <div className="flex flex-col items-center w-full animate-in fade-in zoom-in-95 duration-500">
      <div className="p-6 bg-white rounded-[2.5rem] shadow-2xl shadow-purple-200/50 border border-purple-50 relative group">
        <div className="bg-gray-50 rounded-[1.5rem] p-4 border border-dashed border-gray-200">
          {/* API returns full data URI: data:image/png;base64,... */}
          <img src={qrData} alt="QR Code" className="w-64 h-64 mix-blend-multiply" />
        </div>
       
      </div>

      <div className="mt-12 w-full max-w-sm space-y-3">
        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Invitation Link</label>
        <div className="relative group">
          <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 pr-14 overflow-hidden shadow-inner">
            <p className="text-[11px] font-mono text-gray-500 truncate">{url}</p>
          </div>
          <button 
            onClick={handleCopy} 
            className={`absolute right-2 top-1/2 -translate-y-1/2 p-2.5 rounded-xl transition-all shadow-sm border ${
              copied ? "bg-green-500 border-green-500 text-white" : "bg-white border-gray-100 text-purple-600 hover:bg-purple-600 hover:text-white"
            }`}
          >
            {copied ? <LucideCheck className="w-4 h-4" /> : <LucideCopy className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};