import { Card } from "@/components/ui/card";
import { Calculator, Zap } from "lucide-react";

const Header = ({ overallGwa }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-stretch gap-4">
      {/* Title Section */}
      <div className="flex flex-col justify-center text-center md:text-left space-y-1">
        <div className="flex items-center justify-center md:justify-start gap-3">
          <div className="p-2 ">
            <Calculator className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground">
              GWA Tracker
            </h1>
            <p className="text-sm text-muted-foreground font-medium">
              Academic Performance Dashboard
            </p>
          </div>
        </div>
      </div>

      {/* Right Side: GWA Card & Credits */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="flex flex-col items-end gap-1 order-2 md:order-1">
          <span className="text-[10px] font-medium text-muted-foreground  px-3 py-1 ">
            Made with <span className="text-red-500 animate-pulse">❤️</span> by{" "}
            <span className="text-primary font-bold">AzoreDev</span>
          </span>
        </div>

        <Card className="relative overflow-hidden border-0 shadow-2xl bg-linear-to-br from-blue-600 to-indigo-700 text-white min-w-[200px] order-1 md:order-2 group">
          {/* Abstract Background Shapes */}
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute bottom-0 left-0 -ml-4 -mb-4 w-20 h-20 rounded-full bg-black/10 blur-xl" />

          <div className="relative px-6 py-3 flex flex-row items-center gap-4">
            <div className="flex items-center gap-2 opacity-90">
              <p className="text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                Overall Average
              </p>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-black leading-none tracking-tight filter drop-shadow-md">
                {overallGwa.toFixed(2)}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Header;
