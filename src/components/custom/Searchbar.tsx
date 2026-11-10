import React from "react";
import { Search } from "lucide-react";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterConfig {
  key: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  placeholder?: string;
}

interface SearchbarProps {
  searchQuery?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  filters?: FilterConfig[];
  children?: React.ReactNode;
}

const Searchbar = ({
  searchQuery,
  onSearchChange,
  searchPlaceholder = "Search tickets...",
  filters = [],
  children,
}: SearchbarProps) => {
  return (
    <div className="bg-white dark:bg-slate-900/80 backdrop-blur-xl px-5 py-4 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm dark:shadow-2xl flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 transition-all">
      {/* Search Input Container */}
      {onSearchChange !== undefined && (
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500 pointer-events-none" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery ?? ""}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/90 dark:border-slate-800 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 focus:bg-white dark:focus:bg-slate-950 transition-all shadow-2xs"
          />
        </div>
      )}

      {/* Filters and Custom Actions Container */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 w-full lg:w-auto justify-start lg:justify-end">
        {filters.map((filter) => (
          <div key={filter.key} className="relative">
            <select
              value={filter.value}
              onChange={(e) => filter.onChange(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2.5 bg-slate-50/70 dark:bg-slate-950/50 border border-slate-200/90 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all cursor-pointer shadow-2xs appearance-none pr-8"
            >
              {filter.options.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 py-1"
                >
                  {option.label}
                </option>
              ))}
            </select>
            {/* Custom select chevron indicator */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500 text-xs">
              ▼
            </div>
          </div>
        ))}

        {children}
      </div>
    </div>
  );
};

export default Searchbar;
