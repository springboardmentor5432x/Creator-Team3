import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#22c55e",
  "#f59e0b",
  "#ef4444",
  "#a855f7",
  "#06b6d4",
];

export default function AudiencePieChart({
  data = [],
}) {
  if (!data || data.length === 0) {
    return (
      <div className="empty-chart">
        No audience data available
      </div>
    );
  }

  const formattedData = data.map(
    (item) => ({
      name:
        item.name ||
        item.label ||
        item.gender ||
        item.age,

      value: Number(
        item.value ||
        item.percentage ||
        item.count ||
        0
      ),
    })
  );

  return (
    <div style={{ width: "100%", height: 300 }}>

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <PieChart>

          <Pie
            data={formattedData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="45%"
            outerRadius={90}
            innerRadius={45}
            paddingAngle={3}
            label
          >

            {formattedData.map(
              (entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    COLORS[
                      index %
                        COLORS.length
                    ]
                  }
                />
              )
            )}

          </Pie>

          <Tooltip />

          <Legend />

        </PieChart>

      </ResponsiveContainer>

    </div>
  );
}