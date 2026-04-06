import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import axios from "axios";

// Brand-aligned donut palette
const COLORS = ["#1a1a2e", "#e64e4e", "#f39c12"];

const CustomerGrowthChart = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [newThisMonth, setNewThisMonth] = useState(0);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/users/");
        const users = res.data.users || res.data;

        setTotalUsers(users.length);

        // Count users registered this month
        const now = new Date();
        const thisMonth = users.filter(u => {
          const created = new Date(u.createdAt);
          return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
        });
        setNewThisMonth(thisMonth.length);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, []);

  const returning = totalUsers - newThisMonth;
  const data = [
    { name: "New This Month", value: newThisMonth || 0 },
    { name: "Returning", value: returning > 0 ? returning : 0 },
  ];

  return (
    <div style={{ width: "100%", height: "100%", position: 'relative' }}>
      {/* Center label */}
      <div style={{
        position: 'absolute', top: '42%', left: '50%', transform: 'translate(-50%, -50%)',
        textAlign: 'center', zIndex: 1, pointerEvents: 'none'
      }}>
        <div style={{ fontSize: '28px', fontWeight: '900', color: '#1a1a2e', fontFamily: "'Jost', sans-serif" }}>{totalUsers}</div>
        <div style={{ fontSize: '9px', fontWeight: '700', color: '#aaa', letterSpacing: '2px', textTransform: 'uppercase' }}>Clients</div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="42%"
            innerRadius={50}
            outerRadius={75}
            paddingAngle={4}
            cornerRadius={6}
            stroke="none"
            style={{ fontSize: '11px', fontFamily: "'Jost', sans-serif" }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [value, name]}
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

export default CustomerGrowthChart;
