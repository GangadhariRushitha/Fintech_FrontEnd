import { useEffect, useState } from "react";
import api from "../Api/axiosClient";
import { toast } from "react-toastify";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

export default function TradingPage({ accountId }) {
  const [balance, setBalance] = useState(0);
  const [portfolio, setPortfolio] = useState([]);
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [tradeHistory, setTradeHistory] = useState([]);

  // Load portfolio & balance whenever accountId changes
  useEffect(() => {
    if (!accountId) return;

    const accId = Number(accountId);

    async function loadData() {
      try {
        const token = localStorage.getItem("token");
        const [balRes, portRes, historyRes] = await Promise.all([
          api.get(`/api/accounts/${accId}/balance`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get(`/api/portfolio/${accId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          api.get(`/api/trade/orders?accountId=${accId}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setBalance(Number(balRes.data) || 0);
        setPortfolio(portRes.data || []);
        setTradeHistory(historyRes.data || []);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load account data");
      }
    }

    loadData();
  }, [accountId]);

  // Buy or Sell stock
  const tradeStock = async (type) => {
    if (!accountId || !symbol || !quantity) {
      toast.warning("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const endpoint = type === "BUY" ? "/api/trading/buy" : "/api/trading/sell";

      await api.post(
        endpoint,
        {
          accountId: Number(accountId),
          symbol: symbol.toUpperCase(),
          quantity: Number(quantity),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(`${type} successful`);

      setSymbol("");
      setQuantity("");

      // Refresh portfolio, balance, and trade history
      const [balRes, portRes, historyRes] = await Promise.all([
        api.get(`/api/accounts/${Number(accountId)}/balance`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get(`/api/portfolio/${Number(accountId)}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get(`/api/trade/orders?accountId=${Number(accountId)}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setBalance(Number(balRes.data) || 0);
      setPortfolio(portRes.data || []);
      setTradeHistory(historyRes.data || []);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || "Trade failed. Check balance or symbol.";
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold text-gradient bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
        Trading Dashboard
      </h1>

      {/* Account Balance */}
      <div className="flex gap-3 items-center">
        <span className="font-semibold">Account #{accountId} Balance: ${balance.toFixed(2)}</span>
      </div>

      {/* Portfolio Chart */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4">Portfolio Overview</h2>
        {portfolio.length === 0 ? (
          <p>No stocks in portfolio</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={portfolio}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="symbol" />
              <YAxis />
              <Tooltip formatter={(value) => [value, "Quantity"]} />
              <Bar dataKey="quantity" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Trade Form */}
      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <h2 className="text-xl font-semibold">Trade Stocks</h2>
        <div className="flex flex-col md:flex-row gap-3">
          <input
            type="text"
            placeholder="Stock Symbol (AAPL)"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="border px-3 py-2 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="number"
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="border px-3 py-2 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => tradeStock("BUY")}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex-1"
          >
            Buy
          </button>
          <button
            onClick={() => tradeStock("SELL")}
            disabled={loading}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex-1"
          >
            Sell
          </button>
        </div>
      </div>

      {/* Trade History */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-2">Trade History</h2>
        {tradeHistory.length === 0 ? (
          <p>No trades yet</p>
        ) : (
          <table className="w-full table-auto border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-2 py-1">Date</th>
                <th className="border px-2 py-1">Type</th>
                <th className="border px-2 py-1">Symbol</th>
                <th className="border px-2 py-1">Qty</th>
                <th className="border px-2 py-1">Price</th>
                <th className="border px-2 py-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {tradeHistory.map((t) => (
                <tr key={t.tradeId}>
                  <td className="border px-2 py-1">{new Date(t.timestamp).toLocaleString()}</td>
                  <td
                    className={`border px-2 py-1 font-semibold ${
                      t.tradeType === "BUY" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {t.tradeType}
                  </td>
                  <td className="border px-2 py-1">{t.symbol}</td>
                  <td className="border px-2 py-1">{t.quantity}</td>
                  <td className="border px-2 py-1">${t.price.toFixed(2)}</td>
                  <td className="border px-2 py-1">${(t.price * t.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
