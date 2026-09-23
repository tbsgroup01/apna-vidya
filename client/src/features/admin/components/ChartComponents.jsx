import React, { useState } from "react";

export const EnrollmentLineChart = ({ data = [] }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map((d) => d.students)) * 1.15;
  const width = 600;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;

  const points = data.map((d, i) => {
    const x = paddingX + (i / (data.length - 1)) * (width - paddingX * 2);
    const y = height - paddingY - (d.students / maxVal) * (height - paddingY * 2);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x},${pt.y}` : `${acc} L ${pt.x},${pt.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x},${height - paddingY} L ${points[0].x},${height - paddingY} Z`;

  return (
    <div className="w-full">
      <div className="relative overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 sm:h-56">
          <defs>
            <linearGradient id="enrollmentGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {[0, 0.33, 0.66, 1].map((ratio, idx) => {
            const y = height - paddingY - ratio * (height - paddingY * 2);
            return (
              <line
                key={idx}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            );
          })}

          <path d={areaD} fill="url(#enrollmentGrad)" />
          <path d={pathD} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {points.map((pt, idx) => (
            <g key={idx} onMouseEnter={() => setHoveredIdx(idx)} onMouseLeave={() => setHoveredIdx(null)}>
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredIdx === idx ? 6 : 4}
                className="fill-white stroke-blue-600 stroke-2 cursor-pointer transition-all"
              />
              <text
                x={pt.x}
                y={height - 10}
                textAnchor="middle"
                className="fill-slate-400 text-[11px] font-medium"
              >
                {pt.month}
              </text>
            </g>
          ))}

          {hoveredIdx !== null && (
            <g transform={`translate(${points[hoveredIdx].x}, ${points[hoveredIdx].y - 30})`}>
              <rect
                x="-32"
                y="-18"
                width="64"
                height="24"
                rx="6"
                className="fill-slate-900 shadow-lg"
              />
              <text
                x="0"
                y="-2"
                textAnchor="middle"
                className="fill-white text-[11px] font-bold"
              >
                {points[hoveredIdx].students}
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

export const RevenueBarChart = ({ data = [] }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map((d) => d.amount)) * 1.2;
  const width = 600;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;

  const barWidth = 26;
  const chartAreaWidth = width - paddingX * 2;

  return (
    <div className="w-full">
      <div className="relative overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 sm:h-56">
          {[0, 0.33, 0.66, 1].map((ratio, idx) => {
            const y = height - paddingY - ratio * (height - paddingY * 2);
            return (
              <line
                key={idx}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#e2e8f0"
                strokeDasharray="4 4"
                strokeWidth="1"
              />
            );
          })}

          {data.map((d, i) => {
            const x = paddingX + (i / (data.length - 1)) * chartAreaWidth - barWidth / 2;
            const barHeight = (d.amount / maxVal) * (height - paddingY * 2);
            const y = height - paddingY - barHeight;

            return (
              <g
                key={i}
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-pointer"
              >
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx="6"
                  className={`transition-all duration-200 ${
                    hoveredIdx === i ? "fill-blue-700" : "fill-blue-600/90"
                  }`}
                />
                <text
                  x={x + barWidth / 2}
                  y={height - 10}
                  textAnchor="middle"
                  className="fill-slate-400 text-[11px] font-medium"
                >
                  {d.month}
                </text>
              </g>
            );
          })}

          {hoveredIdx !== null && (
            <g
              transform={`translate(${
                paddingX + (hoveredIdx / (data.length - 1)) * chartAreaWidth
              }, ${
                height - paddingY - (data[hoveredIdx].amount / maxVal) * (height - paddingY * 2) - 25
              })`}
            >
              <rect
                x="-40"
                y="-18"
                width="80"
                height="24"
                rx="6"
                className="fill-slate-900 shadow-lg"
              />
              <text
                x="0"
                y="-2"
                textAnchor="middle"
                className="fill-white text-[11px] font-bold"
              >
                ₹{data[hoveredIdx].amount}L
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

export const CoursePopularityBars = ({ data = [] }) => {
  return (
    <div className="space-y-4">
      {data.map((item, idx) => (
        <div key={idx}>
          <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
            <span className="text-slate-800 truncate pr-2">{item.course}</span>
            <span className="text-slate-500 shrink-0 font-mono">
              {Number(item.count ?? item.enrolled ?? 0).toLocaleString()} ({item.percentage ?? 0}%)
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
              style={{ width: `${item.percentage ?? 0}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export const LeadConversionDonut = ({ data = [] }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);
  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative h-44 w-44 shrink-0">
        <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
          {data.map((slice, i) => {
            const percent = (slice.value / total) * 100;
            const strokeDasharray = `${percent} ${100 - percent}`;
            const strokeDashoffset = -accumulatedPercent;
            accumulatedPercent += percent;

            return (
              <circle
                key={i}
                cx="18"
                cy="18"
                r="15.915"
                fill="none"
                stroke={slice.color}
                strokeWidth="4.5"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300 hover:opacity-80 cursor-pointer"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-black text-slate-900">42%</span>
          <span className="text-[10px] uppercase font-bold text-slate-400">
            Conversion
          </span>
        </div>
      </div>

      <div className="space-y-2.5 w-full">
        {data.map((item, idx) => (
          <div key={idx} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-medium text-slate-700">{item.label}</span>
            </div>
            <span className="font-bold text-slate-900 font-mono">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};
