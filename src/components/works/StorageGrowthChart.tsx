/**
 * StorageGrowthChart —— 累计图片存储增长曲线
 *
 * 输入：
 *   data: [{ date: 'YYYY-MM-DD', storedCount: number }, ...]  ← 已按日期 group + 累加后的结果
 *   retiringDate: 'YYYY-MM-DD'                                 ← 在该日画红色 dashed 标"离职"
 *   width / height: 视口
 *
 * 设计：仿 DauChart 风格，纯 inline SVG
 *  - 横轴 = 日期（按月切分 tick，最多约 6 个 tick）
 *  - 纵轴 = 累计图片数（0 → max, 取整到 100/200/500/...）
 *  - 主折线 + 填充渐变
 *  - retiringDate 处一条红色 dashed vertical line + 标"离职"
 *  - 终点圆点 + 标"X 张 · 至 YYYY-MM-DD"
 */
export type StoragePoint = { date: string; storedCount: number };

interface StorageGrowthChartProps {
  data: StoragePoint[];
  retiringDate?: string;
  width?: number;
  height?: number;
  lang?: "zh" | "en";
}

const PAD_TOP = 36;
const PAD_BOTTOM = 32;
const PAD_LEFT = 56;
const PAD_RIGHT = 24;

function yTicks(maxV: number, count = 4): number[] {
  const step = Math.max(1, Math.ceil(maxV / count / 50) * 50);
  const ticks: number[] = [];
  for (let v = 0; v <= maxV + step; v += step) ticks.push(v);
  if (ticks[ticks.length - 1] > maxV + step) ticks.pop();
  return ticks;
}

function formatMonthDay(iso: string): string {
  const [, m, d] = iso.split("-");
  return `${Number(m)}/${Number(d)}`;
}

export function StorageGrowthChart({
  data,
  retiringDate,
  width = 800,
  height = 260,
  lang = "zh",
}: StorageGrowthChartProps) {
  const isEn = lang === "en";
  const monthLabel = (m: string) => (isEn ? m + "/" : m + "月");
  if (data.length === 0) {
    return (
      <svg viewBox={`0 0 ${width} ${height}`} width="100%" preserveAspectRatio="xMidYMid meet" style={{ display: "block" }}>
        <text x={width / 2} y={height / 2} textAnchor="middle" fill="#888">{isEn ? "No data" : "无数据"}</text>
      </svg>
    );
  }

  const innerW = width - PAD_LEFT - PAD_RIGHT;
  const innerH = height - PAD_TOP - PAD_BOTTOM;

  const x0 = PAD_LEFT;
  const y0 = PAD_TOP;
  const x1 = PAD_LEFT + innerW;
  const y1 = PAD_TOP + innerH;

  const maxV = data[data.length - 1].storedCount;
  const minDate = new Date(data[0].date + "T00:00:00Z").getTime();
  const maxDate = new Date(data[data.length - 1].date + "T00:00:00Z").getTime();
  const span = Math.max(1, maxDate - minDate);

  const xAt = (iso: string) =>
    x0 + ((new Date(iso + "T00:00:00Z").getTime() - minDate) / span) * innerW;
  const yAt = (v: number) => y1 - (v / Math.max(1, maxV)) * innerH;

  const ticks = yTicks(maxV);
  const maxTick = ticks[ticks.length - 1];

  const linePath = data
    .map((p, i) => `${i === 0 ? "M" : "L"}${xAt(p.date).toFixed(2)},${yAt(p.storedCount).toFixed(2)}`)
    .join(" ");
  const areaPath =
    `M${xAt(data[0].date).toFixed(2)},${y1.toFixed(2)} ` +
    data.map((p) => `L${xAt(p.date).toFixed(2)},${yAt(p.storedCount).toFixed(2)}`).join(" ") +
    ` L${xAt(data[data.length - 1].date).toFixed(2)},${y1.toFixed(2)} Z`;

  const retireX = retiringDate ? xAt(retiringDate) : null;

  const uniqueMonths: string[] = [];
  for (const p of data) {
    const m = p.date.slice(0, 7);
    if (!uniqueMonths.includes(m)) uniqueMonths.push(m);
  }
  const monthTicks = uniqueMonths.length <= 2
    ? uniqueMonths
    : uniqueMonths.filter((_, i, arr) => i === 0 || i === arr.length - 1 || i % Math.ceil(arr.length / 5) === 0);

  const last = data[data.length - 1];

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      role="img"
      preserveAspectRatio="xMidYMid meet"
      shapeRendering="geometricPrecision"
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="sgc-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-accent-soft)" stopOpacity="0.45" />
          <stop offset="100%" stopColor="var(--color-accent-soft)" stopOpacity="0.04" />
        </linearGradient>
      </defs>
      <style>{`
        .sgc text {
          font-family: var(--font-serif);
          font-style: italic;
          fill: var(--color-ink-soft);
          font-feature-settings: "liga", "kern";
        }
        .sgc .sgc-axis-y { font-size: 11px; letter-spacing: 0.02em; }
        .sgc .sgc-axis-x { font-size: 11px; letter-spacing: 0.06em; }
        .sgc .sgc-retire-label { fill: var(--color-accent-soft); font-weight: 600; }
        .sgc .sgc-end-label { fill: var(--color-accent); font-weight: 600; font-size: 12px; }
        .sgc .sgc-end-dot-halo { fill: var(--color-accent-soft); opacity: 0.25; }
      `}</style>
      <g className="sgc">
      {ticks.map((t, i) => {
        const y = yAt(Math.min(t, maxTick));
        return (
          <g key={i}>
            <line x1={x0} x2={x1} y1={y} y2={y} stroke="var(--color-rule)" strokeWidth={i === 0 ? 1.2 : 0.6} />
            <text className="sgc-axis-y" x={x0 - 8} y={y + 4} textAnchor="end">{t.toLocaleString()}</text>
          </g>
        );
      })}

      {monthTicks.map((m, i) => {
        const sample = data.find((p) => p.date.startsWith(m));
        if (!sample) return null;
        const x = xAt(sample.date);
        return (
          <text key={i} className="sgc-axis-x" x={x} y={y1 + 18} textAnchor="middle">
            {monthLabel(sample.date.slice(5, 7))}
          </text>
        );
      })}

      <path d={areaPath} fill="url(#sgc-fill)" />
      <path d={linePath} fill="none" stroke="var(--color-accent)" strokeWidth={1.6} strokeLinejoin="round" strokeLinecap="round" />

      {retireX !== null && retireX >= x0 && retireX <= x1 && (
        <g>
          <line x1={retireX} x2={retireX} y1={y0} y2={y1} stroke="var(--color-accent-soft)" strokeWidth={1.4} strokeDasharray="4 3" />
          <text className="sgc-retire-label" x={retireX} y={y0 - 10} textAnchor="middle">{isEn ? "Internship ended" : "实习结束"}</text>
        </g>
      )}

      {/* 终点圆点 + halo —— 让最后一天的数据点成为视线焦点 */}
      <circle className="sgc-end-dot-halo" cx={xAt(last.date)} cy={yAt(last.storedCount)} r={7} />
      <circle cx={xAt(last.date)} cy={yAt(last.storedCount)} r={4} fill="var(--color-accent)" stroke="var(--color-bg)" strokeWidth={1.5} />
      <text
        className="sgc-end-label"
        x={xAt(last.date)}
        y={yAt(last.storedCount) - 16}
        textAnchor="middle"
      >
        {last.storedCount.toLocaleString()}
      </text>
      </g>
    </svg>
  );
}