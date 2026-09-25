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
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
              <stop offset="60%" stopColor="#6366f1" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="enrollmentLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="50%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
            <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#4f46e5" floodOpacity="0.3" />
            </filter>
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
          <path
            d={pathD}
            fill="none"
            stroke="url(#enrollmentLineGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#lineGlow)"
          />

          {points.map((pt, idx) => (
            <g
              key={idx}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="cursor-pointer"
            >
              <circle
                cx={pt.x}
                cy={pt.y}
                r={hoveredIdx === idx ? 7 : 4.5}
                className={`transition-all duration-200 ${hoveredIdx === idx
                  ? "fill-white stroke-indigo-600 stroke-[3px]"
                  : "fill-white stroke-blue-600 stroke-2"
                  }`}
              />
              <text
                x={pt.x}
                y={height - 10}
                textAnchor="middle"
                className="fill-slate-500 text-[13px] font-semibold"
              >
                {pt.month}
              </text>
            </g>
          ))}

          {hoveredIdx !== null && (
            <g transform={`translate(${points[hoveredIdx].x}, ${points[hoveredIdx].y - 32})`}>
              <rect
                x="-36"
                y="-18"
                width="72"
                height="24"
                rx="8"
                className="fill-slate-900 shadow-xl"
              />
              <polygon
                points="0,-2 -4,-6 4,-6"
                className="fill-slate-900"
                transform="translate(0, 10)"
              />
              <text
                x="0"
                y="-2"
                textAnchor="middle"
                className="fill-white text-[13px] font-black"
              >
                {points[hoveredIdx].students} Enrolled
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
          <defs>
            <linearGradient id="revenueBarGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="revenueBarHoverGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
            <filter id="barShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="3" stdDeviation="2" floodColor="#059669" floodOpacity="0.25" />
            </filter>
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
                  fill={hoveredIdx === i ? "url(#revenueBarHoverGrad)" : "url(#revenueBarGrad)"}
                  filter="url(#barShadow)"
                  className="transition-all duration-200"
                />
                <text
                  x={x + barWidth / 2}
                  y={height - 10}
                  textAnchor="middle"
                  className="fill-slate-500 text-[13px] font-semibold"
                >
                  {d.month}
                </text>
              </g>
            );
          })}

          {hoveredIdx !== null && (
            <g
              transform={`translate(${paddingX + (hoveredIdx / (data.length - 1)) * chartAreaWidth
                }, ${height - paddingY - (data[hoveredIdx].amount / maxVal) * (height - paddingY * 2) - 25
                })`}
            >
              <rect
                x="-42"
                y="-18"
                width="84"
                height="24"
                rx="8"
                className="fill-slate-900 shadow-xl"
              />
              <text
                x="0"
                y="-2"
                textAnchor="middle"
                className="fill-white text-[13px] font-black"
              >
                ₹{data[hoveredIdx].amount} Lakhs
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
};

export const CoursePopularityBars = ({ data = [] }) => {
  const barGradients = [
    "from-blue-500 via-indigo-500 to-indigo-600",
    "from-emerald-500 via-teal-500 to-teal-600",
    "from-purple-500 via-fuchsia-500 to-pink-600",
    "from-amber-500 via-orange-500 to-orange-600",
    "from-rose-500 via-pink-500 to-red-600",
    "from-cyan-500 via-sky-500 to-blue-600",
  ];

  const dotGlows = [
    "bg-blue-500 ring-blue-200",
    "bg-emerald-500 ring-emerald-200",
    "bg-purple-500 ring-purple-200",
    "bg-amber-500 ring-amber-200",
    "bg-rose-500 ring-rose-200",
    "bg-cyan-500 ring-cyan-200",
  ];

  return (
    <div className="space-y-4">
      {data.map((item, idx) => {
        const gradient = barGradients[idx % barGradients.length];
        const dot = dotGlows[idx % dotGlows.length];

        return (
          <div key={idx} className="group">
            <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
              <div className="flex items-center gap-2 truncate pr-2">
                <span className={`h-2.5 w-2.5 rounded-full ring-2 shrink-0 ${dot}`} />
                <span className="text-[13px]late-800 font-bold truncate group-hover:text-blue-600 transition-colors">
                  {item.course}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-[13px]late-500 font-mono">
                  {Number(item.count ?? item.enrolled ?? 0).toLocaleString()} learners
                </span>
                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[12px] font-bold text-[13px]late-700">
                  {item.percentage ?? 0}%
                </span>
              </div>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-100 overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${gradient} shadow-sm transition-all duration-700`}
                style={{ width: `${item.percentage ?? 0}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export const LeadConversionDonut = ({ data = [] }) => {
  const vibrantColors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b"];

  const enrichedData = data.map((d, i) => ({
    ...d,
    color: d.color === "#94a3b8" ? "#f43f5e" : d.color || vibrantColors[i % vibrantColors.length],
  }));

  const total = enrichedData.reduce((acc, curr) => acc + curr.value, 0) || 1;
  let accumulatedPercent = 0;

  return (
    <div className="flex flex-col sm:flex-row items-center gap-6">
      <div className="relative h-44 w-44 shrink-0">
        <svg viewBox="0 0 36 36" className="h-full w-full -rotate-90">
          {enrichedData.map((slice, i) => {
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
          <span className="text-2xl font-black text-[13px]late-900">
            {enrichedData[0]?.value || 42}%
          </span>
          <span className="text-[12px] uppercase font-bold text-emerald-600 tracking-wider">
            Conversion
          </span>
        </div>
      </div>

      <div className="space-y-2.5 w-full">
        {enrichedData.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between text-xs rounded-lg p-1.5 hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full ring-2 ring-white shadow-xs"
                style={{ backgroundColor: item.color }}
              />
              <span className="font-semibold text-[13px]late-700">{item.label}</span>
            </div>
            <span
              className="font-bold font-mono px-2 py-0.5 rounded-md text-[13px]"
              style={{ backgroundColor: `${item.color}18`, color: item.color }}
            >
              {item.value}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
