import { useState } from "react";
import api from "../Api/axiosClient";

export default function BuyStock() {
  const [accountId, setAccountId] = useState("");
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const buyStock = async () => {
    if (!accountId || !symbol || !quantity) {
      setMessage("⚠️ Please fill all fields");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await api.post("/api/trade/buy", {
        accountId: Number(accountId),
        symbol: symbol.toUpperCase(),
        quantity: Number(quantity),
      });
      setMessage("✅ Trade Successful");
      setSymbol("");
      setQuantity("");
    } catch (err) {
      console.error(err);
      setMessage("❌ Trade Failed: " + (err.response?.data?.message || ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded shadow max-w-md mx-auto mt-6">
      <h3 className="text-xl font-semibold mb-4">Buy Stock</h3>

      <input
        placeholder="Account ID"
        value={accountId}
        onChange={(e) => setAccountId(e.target.value)}
        className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        placeholder="Stock Symbol (AAPL)"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <input
        placeholder="Quantity"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="w-full mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={buyStock}
        disabled={loading}
        className={`w-full py-2 rounded text-white font-semibold ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "Processing..." : "Buy"}
      </button>

      {message && <p className="mt-3 text-center">{message}</p>}
    </div>
  );
}
