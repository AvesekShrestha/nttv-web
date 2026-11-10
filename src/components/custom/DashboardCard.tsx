import type { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
}

const DashboardCard = ({ title, value, icon: Icon }: DashboardCardProps) => {
  return (
    <div className="w-full bg-white dark:bg-slate-900/90 backdrop-blur-md p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl flex items-center justify-between transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-700 group">
      <div>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          {title}
        </p>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1.5 tracking-tight">
          {value}
        </h3>
      </div>

      <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-600/15 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20 shadow-inner group-hover:scale-105 transition-transform duration-200">
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};

export default DashboardCard;
