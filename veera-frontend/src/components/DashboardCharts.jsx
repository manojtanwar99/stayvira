import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658"];

const DashboardCharts = ({ listings, bookings }) => {
  // Example: Count listings per location
  const locationData = listings.reduce((acc, l) => {
    const loc = l.location || "Unknown";
    const index = acc.findIndex((item) => item.name === loc);
    if (index >= 0) acc[index].value += 1;
    else acc.push({ name: loc, value: 1 });
    return acc;
  }, []);

  // Example: Monthly revenue (from bookings)
  const monthlyRevenue = Array.from({ length: 12 }, (_, i) => ({
    month: new Date(0, i).toLocaleString("default", { month: "short" }),
    revenue: bookings
      .filter((b) => new Date(b.date).getMonth() === i)
      .reduce((sum, b) => sum + (b.amount || 0), 0),
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Listings per Location */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Listings by Location</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={locationData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {locationData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly Revenue */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Monthly Revenue</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="revenue" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DashboardCharts;
