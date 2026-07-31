/**
 * DauChart —— 折线图（纯 inline SVG 手绘）
 *
 * 输入：
 *   data: [{ date: 'YYYY-MM-DD', dau: number }, ...]
 *   joinedUsers: [{ joinedAt: 'YYYY-MM-DD', role: string }]
 *
 * 设计：
 *  - 视口 800×260，padding 44 顶 / 24 底 / 36 左 / 24 右
 *  - 主折线 + 淡填充；y 轴刻度 0/2/4/6/8/10
 *  - 每个角色加入点用垂直虚线 + 角色名标签（若空间不足则截断）
 */
export type DauPoint = { date: string; dau: number };
export type DauUser = { joinedAt: string; role: string };

interface DauChartProps {
  data: DauPoint[];
  users: DauUser[];
  width?: number;
  height?: number;
  retiredDate?: string;
  retiredLabel?: string;
}

export function DauChart({
  data,
  users,
  width = 800,
  height = 260,
  retiredDate,
  retiredLabel,
}: DauChartProps) {
  const PAD_L = 44;
  const PAD_R = 24;
  const PAD_T = 36;
  const PAD_B = 56;
  const innerW = width - PAD_L - PAD_R;
  const innerH = height - PAD_T - PAD_B;

  const yMax = 10;
  const yTicks = [0, 2, 4, 6, 8, 10];

  const xMin = new Date(data[0].date).getTime();
  const xMax = new Date(data[data.length - 1].date).getTime();
  const xSpan = Math.max(xMax - xMin, 1);

  const xOf = (date: string) =>
    PAD_L + ((new Date(date).getTime() - xMin) / xSpan) * innerW;
  const yOf = (v: number) => PAD_T + (1 - v / yMax) * innerH;

  // 折线点
  const points = data.map((d) => `${xOf(d.date)},${yOf(d.dau)}`).join(" ");
  // 填充区路径
  const fillPath = `M ${xOf(data[0].date)},${PAD_T + innerH} L ${points.replaceAll(
    ",",
    " ",
  )} L ${xOf(data[data.length - 1].date)},${PAD_T + innerH} Z`;

  // 7 个里程碑日期（用户加入日）
  const milestones = users.slice(0, 7);

  // x 轴标签：每月 1 日
  const monthLabels: { x: number; label: string }[] = [];
  const seenMonths = new Set<string>();
  data.forEach((d) => {
    const key = d.date.slice(0, 7);
    if (d.date.endsWith("-01") && !seenMonths.has(key)) {
      seenMonths.add(key);
      monthLabels.push({
        x: xOf(d.date),
        label: d.date.slice(0, 7).replace("-", "."),
      });
    }
  });

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="pr-dau-svg"
      preserveAspectRatio="xMidYMid meet"
      shapeRendering="geometricPrecision"
      aria-label="DAU trend from 2026-03-22 to 2026-06-30"
    >
      {/* 暖白底 + 墨绿主色 */}
      <g>
        {/* y 网格线 + 刻度 */}
        {yTicks.map((t) => (
          <g key={t}>
            <line
              x1={PAD_L}
              x2={PAD_L + innerW}
              y1={yOf(t)}
              y2={yOf(t)}
              stroke="currentColor"
              strokeWidth="0.4"
              opacity="0.18"
              strokeDasharray="2 4"
            />
            <text
              x={PAD_L - 8}
              y={yOf(t) + 4}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize="9"
              fill="currentColor"
              opacity="0.55"
            >
              {t}
            </text>
          </g>
        ))}

        {/* x 轴月份标签 */}
        {monthLabels.map((m, i) => (
          <text
            key={i}
            x={m.x}
            y={height - PAD_B + 22}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize="9"
            letterSpacing="0.12em"
            fill="currentColor"
            opacity="0.6"
          >
            {m.label}
          </text>
        ))}

        {/* 填充区 */}
        <path d={fillPath} fill="currentColor" opacity="0.08" />

        {/* 主折线 */}
        <polyline
          points={points}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.85"
        />

        {/* 离职日红色虚线（若有） */}
        {retiredDate && (() => {
          const tx = new Date(retiredDate).getTime();
          if (tx < xMin || tx > xMax) return null;
          const x = xOf(retiredDate);
          return (
            <g>
              <line
                x1={x}
                x2={x}
                y1={PAD_T}
                y2={PAD_T + innerH}
                stroke="currentColor"
                strokeWidth="0.8"
                strokeDasharray="3 3"
                opacity="0.45"
              />
              {retiredLabel && (
                <text
                  x={x}
                  y={PAD_T - 8}
                  textAnchor="middle"
                  fontFamily="var(--font-serif)"
                  fontStyle="italic"
                  fontSize="10"
                  fill="currentColor"
                  opacity="0.85"
                >
                  {retiredLabel}
                </text>
              )}
            </g>
          );
        })()}

        {/* 用户加入里程碑 */}
        {milestones.map((u, i) => {
          const tx = new Date(u.joinedAt).getTime();
          if (tx < xMin || tx > xMax) return null;
          const x = xOf(u.joinedAt);
          const dy = 16 + (i % 2) * 18;
          // 标签轮流上下避免重叠
          return (
            <g key={i}>
              <line
                x1={x}
                x2={x}
                y1={PAD_T}
                y2={PAD_T + innerH}
                stroke="currentColor"
                strokeWidth="0.6"
                strokeDasharray="1 4"
                opacity="0.35"
              />
              <circle cx={x} cy={yOf(0)} r="2.4" fill="currentColor" opacity="0.8" />
              <text
                x={x + 4}
                y={PAD_T - dy + 6}
                fontFamily="var(--font-serif)"
                fontSize="9.5"
                fontStyle="italic"
                fill="currentColor"
                opacity="0.78"
              >
                + {u.role}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}