import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Props = {
  data: any[];
};

const isUnsafe = (data) => {
  return data.tds > 1000 || data.turbidity > 25 || data.ph < 6.5 || data.ph > 8.5;
};

export const WaterGraph = ({ data }: Props) => {
  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 shadow-xl hover:scale-[1.02] transition duration-300">      <h2 className="text-sm font-semibold mb-3">📊 Water Trends</h2>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
            <XAxis dataKey="time" stroke="#94a3b8" />
<YAxis stroke="#94a3b8" />
            <Tooltip
            contentStyle={{
            backgroundColor: "#0f172a",
            border: "1px solid #334155",
            borderRadius: "10px",
            }}
            />
            <Line
            type="monotone"
            dataKey="ph"
            stroke="#3b82f6"
            strokeWidth={2}
            isAnimationActive={true}
            animationDuration={1000}
            />

            <Line
            type="monotone"
            dataKey="tds"
            stroke={data.some(isUnsafe) ? "#ef4444" : "#22c55e"}
            strokeWidth={3}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            isAnimationActive={true}
            animationDuration={1000}
            />

            <Line
            type="monotone"
            dataKey="turbidity"
            stroke="#f59e0b"
            strokeWidth={2}
            isAnimationActive={true}
            animationDuration={1000}
            />

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};