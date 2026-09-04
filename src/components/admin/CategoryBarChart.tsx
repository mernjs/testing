"use client";

import { motion } from "framer-motion";

interface CategoryBarChartProps {
  data: { label: string; value: number }[];
}

export default function CategoryBarChart({ data }: CategoryBarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div className="flex h-48 items-stretch gap-3">
      {data.map((d, i) => (
        <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
          <span className="text-xs font-semibold text-foreground">{d.value}</span>
          <div className="flex w-full flex-1 items-end">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${d.value > 0 ? Math.max((d.value / max) * 100, 4) : 0}%` }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
              className="w-full rounded-t-md bg-gradient-to-t from-primary to-[#ff8e75]"
            />
          </div>
          <span className="text-center text-[11px] leading-tight text-muted-foreground">{d.label}</span>
        </div>
      ))}
    </div>
  );
}
