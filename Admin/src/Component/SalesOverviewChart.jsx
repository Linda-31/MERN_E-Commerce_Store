import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import { startOfWeek, format } from 'date-fns';

const SalesOverviewChart = () => {
  const [weeklyData, setWeeklyData] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("https://mern-store-server.onrender.com/api/orders/all");
        const orders = res.data;

        const weekMap = {};

        orders.forEach(order => {
          const date = new Date(order.createdAt);
          const weekStart = startOfWeek(date, { weekStartsOn: 1 });
          const weekKey = format(weekStart, 'yyyy-MM-dd');

          if (!weekMap[weekKey]) weekMap[weekKey] = 0;
          weekMap[weekKey] += order.totalAmount || 0;
        });

        const chartData = Object.keys(weekMap)
          .sort()
          .map(week => ({ week, sales: weekMap[week] }));

        setWeeklyData(chartData);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={weeklyData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="week" tick={{ fontSize: 11, fontFamily: "'Jost', sans-serif", fill: '#888' }} />
          <YAxis tick={{ fontSize: 11, fontFamily: "'Jost', sans-serif", fill: '#888' }} />
          <Tooltip
            formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 8px 25px rgba(0,0,0,0.1)', fontSize: '12px', fontFamily: "'Jost', sans-serif" }}
          />
          <Legend
            iconType="circle"
            iconSize={8}
            wrapperStyle={{ fontSize: '11px', fontWeight: '600', letterSpacing: '0.5px', fontFamily: "'Jost', sans-serif" }}
          />
          <Line type="monotone" dataKey="sales" name="Weekly Revenue" stroke="#e64e4e" strokeWidth={2.5} dot={{ fill: '#e64e4e', r: 4, strokeWidth: 0 }} activeDot={{ r: 7, fill: '#1a1a2e', stroke: '#e64e4e', strokeWidth: 2 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesOverviewChart;
