interface TimeSeriesPoint {
  date: string;
  count: number;
}

const WIDTH = 600;
const HEIGHT = 180;
const PADDING = 8;

export default function SubmissionsTimeChart({ data }: { data: TimeSeriesPoint[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-muted-foreground">
        No submissions in this range.
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.count), 1);

  const points = data.map((d, i) => {
    const x = data.length === 1 ? WIDTH / 2 : (i / (data.length - 1)) * (WIDTH - PADDING * 2) + PADDING;
    const y = HEIGHT - PADDING - (d.count / max) * (HEIGHT - PADDING * 2);
    return { x, y };
  });

  const linePath = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const last = points[points.length - 1];
  const first = points[0];
  const areaPath = `${linePath} L ${last.x.toFixed(1)} ${HEIGHT - PADDING} L ${first.x.toFixed(1)} ${HEIGHT - PADDING} Z`;

  return (
    <div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="h-48 w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="timeChartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E56043" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#E56043" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="timeChartLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#E56043" />
            <stop offset="100%" stopColor="#ff8e75" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#timeChartFill)" stroke="none" />
        <path d={linePath} fill="none" stroke="url(#timeChartLine)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3} fill="#E56043" />
        ))}
      </svg>
      <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>{data[0].date}</span>
        <span>{data[data.length - 1].date}</span>
      </div>
    </div>
  );
}
