import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { time: "22:00", rms: 4.2, seeing: 2.1 },
  { time: "22.12", rms: 3.0, seeing: 1.4 },
  { time: "22.14", rms: 4.8, seeing: 2.2 },
  { time: "22.16", rms: 3.3, seeing: 1.5 },
  { time: "22.18", rms: 2.4, seeing: 1.2 },
];

const TelemetryChart = () => {
  return (
    <div className="bg-[#0f2537] border border-[#1c3b5a]/40 shadow-md rounded-2xl p-4">
      <h2 className="text-gray-200 font-semibold text-lg mb-4">
        Real-time Telemetry
      </h2>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="time" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#1c3b5a",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
            }}
          />
          <Line
            type="monotone"
            dataKey="rms"
            stroke="#38bdf8"
            strokeWidth={2}
            dot={false}
            name="Tracking Error (RMS)"
          />
          <Line
            type="monotone"
            dataKey="seeing"
            stroke="#60a5fa"
            strokeWidth={2}
            dot={false}
            name="Seeing (FWHM)"
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-6 text-sm text-gray-400 mt-3">
        <span className="flex items-center gap-1">
          <span className="w-4 h-0.5 bg-sky-400 inline-block"></span>
          Tracking Error (RMS)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-4 h-0.5 bg-blue-400 inline-block"></span>
          Seeing (FWHM)
        </span>
      </div>
    </div>
  );
};

export default TelemetryChart;
