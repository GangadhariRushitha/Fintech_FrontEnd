// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import api from "../Api/axiosClient";

// export default function Dashboard() {
//   const [accounts, setAccounts] = useState([]);
//   const [userName] = useState("User");
//   const navigate = useNavigate();

//   useEffect(() => {
//     // load accounts
//     async function load() {
//       try {
//         const res = await api.get("/api/accounts"); // assume returns list of accounts
//         setAccounts(res.data || []);
//       } catch (e) {
//         console.error(e);
//       }
//     }
//     load();
//   }, []);

//   const totalBalance = accounts.reduce((sum, a) => sum + (Number(a.balance) || 0), 0);

//   return (
//     <div className="container mx-auto p-6">
//       <div className="flex items-center justify-between mb-6">
//         <div>
//           <h1 className="text-2xl font-semibold">Welcome, {userName}!</h1>
//           <p className="text-sm text-gray-600">Account overview</p>
//         </div>
//         <div>
//           <button
//             onClick={() => navigate('/transfer')}
//             className="bg-blue-600 text-white px-4 py-2 rounded-md shadow hover:bg-blue-700 mr-2"
//           >
//             Send Money
//           </button>
//           <button
//             onClick={() => navigate('/concurrencytest')}
//             className="bg-white border border-gray-200 px-4 py-2 rounded-md shadow hover:bg-gray-50"
//           >
//             Test Concurrency
//           </button>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
//         <div className="bg-white p-6 rounded-lg shadow">
//           <h3 className="text-sm text-gray-500">Total Balance</h3>
//           <div className="text-3xl font-bold mt-2">${totalBalance.toFixed(2)}</div>

//           <div className="mt-6">
//             <h4 className="font-medium">Your Accounts</h4>
//             <div className="mt-3 space-y-3">
//               {accounts.map((acc) => (
//                 <div key={acc.accountId} className="flex items-center justify-between p-3 border rounded">
//                   <div>
//                     <div className="text-sm text-gray-500">Account #{acc.accountId}</div>
//                     <div className="font-medium">{acc.currency} {Number(acc.balance).toFixed(2)}</div>
//                   </div>
//                   <div>
//                     <button onClick={() => navigate(`/transfer?from=${acc.accountId}`)} className="text-blue-600">Send</button>
//                   </div>
//                 </div>
//               ))}
//               {accounts.length === 0 && <div className="text-sm text-gray-500">No accounts found</div>}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }





















import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api/axiosClient";
import { downloadMonthlyStatement } from "../Api/statementApi";
import { getPortfolio } from "../Api/portfolioApi";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LabelList,
  Cell,
} from "recharts";

export default function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [downloadingId, setDownloadingId] = useState(null);

  const navigate = useNavigate();

  const colorMap = {
    AAPL: "#3b82f6",
    GOOGL: "#10b981",
    TSLA: "#f59e0b",
    default: "#6366f1",
  };

  useEffect(() => {
    async function loadData() {
      try {
        const accRes = await api.get("/api/accounts");
        setAccounts(accRes.data || []);

        const portRes = await getPortfolio();
        setPortfolio(portRes.data || []);
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, []);

  const handleDownloadStatement = async (accountId) => {
    if (!selectedMonth) {
      alert("Please select a month");
      return;
    }
    try {
      setDownloadingId(accountId);
      const pdfData = await downloadMonthlyStatement(accountId, selectedMonth);
      const blob = new Blob([pdfData], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `VaultCore_Statement_${accountId}_${selectedMonth}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } finally {
      setDownloadingId(null);
    }
  };

  const totalBalance = accounts.reduce(
    (sum, a) => sum + (Number(a.balance) || 0),
    0
  );

  const totalPortfolio = portfolio.reduce(
    (sum, p) => sum + (p.totalValue || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white px-6 py-6 shadow">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h1 className="text-2xl font-bold">VaultCore Dashboard</h1>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/transfer")}
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-medium shadow hover:bg-gray-100 transition"
            >
              Send Money
            </button>
            <button
              onClick={() => navigate("/concurrencytest")}
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg shadow hover:bg-gray-100 transition"
            >
              Concurrency Test
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SummaryCard title="Total Balance" value={`$${totalBalance.toFixed(2)}`} />
          <SummaryCard title="Total Accounts" value={accounts.length} />
          <SummaryCard
            title="Portfolio Value"
            value={`$${totalPortfolio.toFixed(2)}`}
          />
        </div>

        {/* Accounts */}
        <div className="bg-white rounded-xl shadow p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
            <h3 className="text-lg font-semibold">Your Accounts</h3>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="border rounded px-3 py-1"
            />
          </div>

          {accounts.length > 0 ? (
            <div className="space-y-3">
              {accounts.map((acc) => (
                <div
                  key={acc.accountId}
                  className="flex flex-col sm:flex-row sm:justify-between sm:items-center border rounded-lg p-4 hover:bg-gray-50 transition"
                >
                  <div>
                    <p className="text-sm text-gray-500">
                      Account #{acc.accountId}
                    </p>
                    <p className="font-semibold">
                      {acc.currency} {Number(acc.balance).toFixed(2)}
                    </p>
                  </div>
                  <div className="flex gap-4 mt-3 sm:mt-0">
                    <button
                      onClick={() =>
                        navigate(`/transfer?from=${acc.accountId}`)
                      }
                      className="text-blue-600 hover:underline"
                    >
                      Send
                    </button>
                    <button
                      onClick={() => handleDownloadStatement(acc.accountId)}
                      disabled={downloadingId === acc.accountId}
                      className="text-green-600 hover:underline"
                    >
                      {downloadingId === acc.accountId
                        ? "Generating..."
                        : "Statement"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No accounts found</p>
          )}
        </div>

        {/* Portfolio */}
        <div className="bg-white rounded-xl shadow p-6">
          <h3 className="text-lg font-semibold mb-4">
            📊 Portfolio Overview
          </h3>

          {portfolio.length > 0 ? (
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={portfolio}>
                <XAxis dataKey="symbol" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalValue">
                  <LabelList dataKey="totalValue" position="top" />
                  {portfolio.map((p) => (
                    <Cell
                      key={p.symbol}
                      fill={colorMap[p.symbol] || colorMap.default}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-gray-500">
              No portfolio data available
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/* Small reusable component */
function SummaryCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-6 hover:shadow-lg transition">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}
