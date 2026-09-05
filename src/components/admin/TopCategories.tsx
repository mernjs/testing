"use client";

import { motion } from "framer-motion";

interface TopCategoryDatum {
  category: string;
  label: string;
  total: number;
  completed: number;
  completionRate: number;
}

export default function TopCategories({ data }: { data: TopCategoryDatum[] }) {
  const max = Math.max(...data.map((d) => d.total), 1);

  return (
    <div className="space-y-4">
      {data.map((d, i) => (
        <div key={d.category}>
          <div className="mb-1 flex items-center justify-between text-sm">
            <span className="font-medium text-foreground">{d.label}</span>
            <span className="text-muted-foreground">
              {d.total} <span className="text-xs">· {d.completionRate}% completed</span>
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(d.total / max) * 100}%` }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-primary to-[#ff8e75]"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
