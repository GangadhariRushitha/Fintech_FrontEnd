import React, { useState } from "react";
import api from "../Api/axiosClient";

export default function ConcurrencyTest() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState(10);
  const [count, setCount] = useState(100);
  const [status, setStatus] = useState("");

  const runConcurrent = async () => {
    setStatus("Running concurrency test...");

    const body = {
      fromAccountId: Number(from),
      toAccountId: Number(to),
      amount: Number(amount),
      currency: "USD",
      description: "Concurrency Test"
    };

    try {
      const res = await api.post(
        `/api/debug/transfer/simulate?count=${count}`,
        body
      );
      setStatus(res.data);
    } catch (err) {
      console.error(err);
      setStatus("Concurrency test failed");
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">
          Concurrency Test — Transaction Engine
        </h3>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-sm text-gray-600">
              From Account ID
            </label>
            <input
              className="mt-1 p-2 w-full rounded border"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">
              To Account ID
            </label>
            <input
              className="mt-1 p-2 w-full rounded border"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">
              Amount per transfer
            </label>
            <input
              className="mt-1 p-2 w-full rounded border"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">
              Thread Count
            </label>
            <input
              className="mt-1 p-2 w-full rounded border"
              value={count}
              onChange={(e) => setCount(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={runConcurrent}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full"
        >
          Run {count} Concurrent Transfers
        </button>

        <div className="mt-4 text-sm text-gray-700">
          {status}
        </div>
      </div>
    </div>
  );
}
