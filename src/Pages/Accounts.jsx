import { useEffect, useState } from "react";
import api from "../Api/axiosClient";

export default function Accounts() {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const res = await api.get("/api/accounts");
        setAccounts(res.data);
      } catch (err) {
        console.error("Error fetching accounts:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAccounts();
  }, []);

  if (loading) {
    return <div className="text-center mt-10 text-gray-500">Loading accounts...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">All Accounts</h2>

      <div className="bg-white shadow rounded-lg p-4">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-gray-600">Account ID</th>
              <th className="px-4 py-2 text-left text-gray-600">Owner User ID</th>
              <th className="px-4 py-2 text-left text-gray-600">Currency</th>
              <th className="px-4 py-2 text-left text-gray-600">Balance</th>
            </tr>
          </thead>

          <tbody>
            {accounts.map((acc) => (
              <tr key={acc.accountId} className="border-t">
                <td className="px-4 py-2">{acc.accountId}</td>
                <td className="px-4 py-2">{acc.ownerUserId}</td>
                <td className="px-4 py-2">{acc.currency}</td>
                <td className="px-4 py-2 font-semibold">${acc.balance}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
