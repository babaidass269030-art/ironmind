import React, { useState } from 'react';

export interface ChartDataPoint {
  label: string; // e.g. "Sep 12"
  value: number;
  secondaryValue?: number;
  dateStr?: string;
}

interface SimpleLineChartProps {
  data: ChartDataPoint[];
  unit: string;
  lineColor?: string;
  height?: number;
  emptyMessage?: string;
}

export const SimpleLineChart: React.FC<SimpleLineChartProps> = ({
  data,
  unit,
  lineColor = '#f59e0b',
  height = 180,
  emptyMessage = 'Log more sessions to generate trends'
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-2xl bg-slate-900/40 border border-slate-800/80 p-6 text-center"
        style={{ height }}
      >
        <span className="text-2xl mb-1">📉</span>
        <p className="text-xs text-slate-400 font-medium">{emptyMessage}</p>
      </div>
    );
  }

  // If single data point
  if (data.length === 1) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-2xl bg-slate-900/40 border border-slate-800/80 p-6 text-center"
        style={{ height }}
      >
        <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Latest Recorded</span>
        <p className="text-2xl font-bold font-mono text-white mt-1">
          {data[0].value} <span className="text-sm font-normal text-amber-400">{unit}</span>
        </p>
        <span className="text-[11px] text-slate-500 mt-1">{data[0].label}</span>
      </div>
    );
  }

  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const paddingY = (maxVal - minVal) * 0.15 || 2;
  const domainMin = Math.max(0, minVal - paddingY);
  const domainMax = maxVal + paddingY;
  const range = domainMax - domainMin || 1;

  const width = 360;
  const paddingTop = 20;
  const paddingBottom = 30;
  const paddingLeft = 36;
  const paddingRight = 16;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const points = data.map((d, i) => {
    const x = paddingLeft + (i / (data.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((d.value - domainMin) / range) * chartHeight;
    return { x, y, data: d, index: i };
  });

  const pathD = points.reduce((acc, curr, i) => {
    return i === 0 ? `M ${curr.x} ${curr.y}` : `${acc} L ${curr.x} ${curr.y}`;
  }, '');

  // Fill area under path
  const areaD = `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;

  const selectedPoint = selectedIndex !== null ? points[selectedIndex] : points[points.length - 1];

  return (
    <div className="w-full flex flex-col">
      <div className="flex items-center justify-between px-2 mb-2">
        <span className="text-xs text-slate-400">
          {selectedPoint ? selectedPoint.data.label : 'Progression'}
        </span>
        <span className="text-sm font-bold font-mono text-white">
          {selectedPoint ? `${selectedPoint.data.value} ${unit}` : ''}
        </span>
      </div>

      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible select-none"
        >
          <defs>
            <linearGradient id={`chart-grad-${lineColor.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={lineColor} stopOpacity="0.25" />
              <stop offset="100%" stopColor={lineColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingLeft}
            y1={paddingTop}
            x2={width - paddingRight}
            y2={paddingTop}
            stroke="#1e2433"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <line
            x1={paddingLeft}
            y1={paddingTop + chartHeight / 2}
            x2={width - paddingRight}
            y2={paddingTop + chartHeight / 2}
            stroke="#1e2433"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <line
            x1={paddingLeft}
            y1={paddingTop + chartHeight}
            x2={width - paddingRight}
            y2={paddingTop + chartHeight}
            stroke="#222838"
            strokeWidth="1"
          />

          {/* Y-axis labels */}
          <text
            x={paddingLeft - 8}
            y={paddingTop + 4}
            textAnchor="end"
            fontSize="9"
            fill="#64748b"
            className="font-mono"
          >
            {Math.round(domainMax)}
          </text>
          <text
            x={paddingLeft - 8}
            y={paddingTop + chartHeight}
            textAnchor="end"
            fontSize="9"
            fill="#64748b"
            className="font-mono"
          >
            {Math.round(domainMin)}
          </text>

          {/* Area under curve */}
          <path
            d={areaD}
            fill={`url(#chart-grad-${lineColor.replace('#', '')})`}
          />

          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke={lineColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Points */}
          {points.map((pt, i) => (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r={selectedIndex === i || (selectedIndex === null && i === points.length - 1) ? 5 : 3}
              fill={lineColor}
              stroke="#0c0e14"
              strokeWidth="2"
              className="cursor-pointer transition-all hover:scale-125"
              onClick={() => setSelectedIndex(i)}
            />
          ))}
        </svg>
      </div>
    </div>
  );
};

export const SimpleBarChart: React.FC<{
  data: { label: string; count: number; active?: boolean }[];
  targetCount?: number;
  height?: number;
}> = ({ data, targetCount = 1, height = 120 }) => {
  const maxVal = Math.max(...data.map((d) => d.count), targetCount, 1);

  return (
    <div className="w-full flex items-end justify-between gap-1.5 pt-4 pb-2" style={{ height }}>
      {data.map((item, idx) => {
        const pct = Math.min((item.count / maxVal) * 100, 100);
        const isCurrent = item.active;

        return (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
            <span className="text-[10px] font-mono text-slate-400 font-semibold">
              {item.count > 0 ? item.count : '·'}
            </span>
            <div className="w-full max-w-[28px] h-full bg-slate-800/80 rounded-md relative flex items-end overflow-hidden">
              <div
                className={`w-full rounded-md transition-all duration-500 ${
                  item.count >= targetCount
                    ? 'bg-emerald-500'
                    : item.count > 0
                    ? 'bg-amber-500'
                    : 'bg-transparent'
                }`}
                style={{ height: `${Math.max(pct, item.count > 0 ? 12 : 0)}%` }}
              />
            </div>
            <span
              className={`text-[10px] font-medium tracking-tight ${
                isCurrent ? 'text-amber-400 font-bold' : 'text-slate-500'
              }`}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};
