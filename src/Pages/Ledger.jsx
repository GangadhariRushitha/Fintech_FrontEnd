import React, { useEffect, useState } from "react";
import api from "../Api/axiosClient";

export default function Ledger() {
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const r = await api.get('/api/ledger');
        setEntries(r.data || []);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Ledger</h3>
        <div className="space-y-3 text-sm">
          {entries.length === 0 && <div className="text-gray-400">No ledger entries</div>}
          {entries.map(e => (
            <div key={e.id} className="flex justify-between border p-3 rounded">
              <div>
                <div className="font-medium">{e.entryType} ${Number(e.amount).toFixed(2)}</div>
                <div className="text-gray-500 text-xs">Tx: {e.transactionId}</div>
              </div>
              <div className="text-gray-500 text-xs">{new Date(e.entryTimestamp).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
