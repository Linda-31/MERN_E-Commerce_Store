import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Tooltip, Legend, Cell, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

// Premium palette — cohesive with KUSHI admin brand
const COLORS = ["#1a1a2e", "#e64e4e", "#f39c12", "#2ecc71", "#3498db", "#9b59b6", "#e67e22"];

const MonthlySalesPie = () => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("https://mern-store-server.onrender.com/api/orders/all");
        const orders = res.data;

        const monthMap = {};
        orders.forEach(order => {
          const date = new Date(order.createdAt);
          const monthKey = format(date, "MMM yyyy");
          if (!monthMap[monthKey]) monthMap[monthKey] = 0;
          monthMap[monthKey] += order.totalAmount || 0;
        });

        const data = Object.keys(monthMap)
          .sort((a, b) => new Date(a) - new Date(b))
          .map(month => ({ name: month, value: monthMap[month] }));

        setChartData(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={95}
            paddingAngle={3}
            cornerRadius={4}
            stroke="none"
            label={({ name, value }) => `${name}: ₹${value.toLocaleString("en-IN")}`}
            style={{ fontSize: '11px', fontWeight: '600', fontFamily: "'Jost', sans-serif" }}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [`₹${value.toLocaleString("en-IN")}`, 'Revenue']}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 8px 25px rgba(0,0,0,0.1)', fontSize: '12px', fontFamily: "'Jost', sans-serif" }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.5px', fontFamily: "'Jost', sans-serif" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlySalesPie;
