import { useEffect, useState } from "react";
import api from "../Api/axiosClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function PortfolioDashboard({ accountId }) {
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/api/portfolio/${accountId}`)
      .then((res) => setPortfolio(res.data || []))
      .catch((err) => console.error("Error loading portfolio", err))
      .finally(() => setLoading(false));
  }, [accountId]);

  if (loading) return <p>Loading portfolio...</p>;
  if (portfolio.length === 0) return <p>No stocks in portfolio.</p>;

  return (
    <div className="mt-6 p-4 bg-white rounded shadow">
      <h3 className="text-xl font-semibold mb-4">Portfolio Overview</h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={portfolio} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="symbol" />
          <YAxis />
          <Tooltip formatter={(value) => [value, "Quantity"]} />
          <Bar dataKey="quantity" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
