// import React, { useEffect, useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import api from "../Api/axiosClient";

// export default function Transfer() {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const queryParams = new URLSearchParams(location.search);
//   const defaultFromId = queryParams.get("from");

//   const [step, setStep] = useState(1);
  
//   const [fromAccountId, setFromAccountId] = useState(defaultFromId || "");
//   const [toAccountId, setToAccountId] = useState("");
//   const [amount, setAmount] = useState("");
//   const [currency, setCurrency] = useState("USD");
//   const [description, setDescription] = useState("");

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [transactionId, setTransactionId] = useState(null);

//   useEffect(() => {
//     if (defaultFromId) setFromAccountId(defaultFromId);
//   }, [defaultFromId]);

//   /* ---------------- STEP 1 VALIDATION ---------------- */
//   const nextStep = () => {
//     setError("");

//     if (!fromAccountId || !toAccountId || !amount) {
//       setError("All required fields must be filled.");
//       return;
//     }

//     if (Number(amount) <= 0) {
//       setError("Amount must be greater than zero.");
//       return;
//     }

//     if (fromAccountId === toAccountId) {
//       setError("From and To accounts must be different.");
//       return;
//     }

//     setStep(2);
//   };

//   /* ---------------- FINAL SUBMIT ---------------- */
//   const confirmTransfer = async () => {
//     setLoading(true);
//     setError("");

//     try {
//       const res = await api.post("/api/transfer", {
//         fromAccountId: Number(fromAccountId),
//         toAccountId: Number(toAccountId),
//         amount: Number(amount),
//         currency,
//         description,
//       });

//       setTransactionId(res.data.transactionId);
//       setStep(3);
//     } catch (err) {
//       const msg =
//         err?.response?.data?.message ||
//         err.message ||
//         "Transfer failed";
//       setError(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* ---------------- UI ---------------- */
//   return (
//     <div className="max-w-lg mx-auto p-6">
//       <div className="bg-white p-6 rounded-lg shadow">
//         <h2 className="text-xl font-semibold mb-4">Send Money</h2>

//         {error && (
//           <div className="mb-4 text-sm text-red-600">{error}</div>
//         )}

//         {/* -------- STEP 1: INPUT -------- */}
//         {step === 1 && (
//           <>
//             <label className="block text-sm font-medium">From Account ID</label>
//             <input
//               type="number"
//               value={fromAccountId}
//               onChange={(e) => setFromAccountId(e.target.value)}
//               className="input"
//             />

//             <label className="block text-sm font-medium mt-3">To Account ID</label>
//             <input
//               type="number"
//               value={toAccountId}
//               onChange={(e) => setToAccountId(e.target.value)}
//               className="input"
//             />

//             <label className="block text-sm font-medium mt-3">Amount</label>
//             <input
//               type="number"
//               value={amount}
//               onChange={(e) => setAmount(e.target.value)}
//               className="input"
//             />

//             <label className="block text-sm font-medium mt-3">Currency</label>
//             <select
//               className="input"
//               value={currency}
//               onChange={(e) => setCurrency(e.target.value)}
//             >
//               <option value="USD">USD</option>
//             </select>

//             <label className="block text-sm font-medium mt-3">Description</label>
//             <textarea
//               className="input"
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//             />

//             <button
//               onClick={nextStep}
//               className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
//             >
//               Next
//             </button>
//           </>
//         )}

//         {/* -------- STEP 2: REVIEW -------- */}
//         {step === 2 && (
//           <>
//             <p><strong>From:</strong> {fromAccountId}</p>
//             <p><strong>To:</strong> {toAccountId}</p>
//             <p><strong>Amount:</strong> {amount} {currency}</p>
//             <p><strong>Description:</strong> {description || "-"}</p>

//             <div className="mt-4 flex gap-3">
//               <button
//                 onClick={() => setStep(1)}
//                 className="px-4 py-2 border rounded"
//               >
//                 Back
//               </button>

//               <button
//                 onClick={confirmTransfer}
//                 disabled={loading}
//                 className="bg-green-600 text-white px-4 py-2 rounded"
//               >
//                 {loading ? "Processing..." : "Confirm Transfer"}
//               </button>
//             </div>
//           </>
//         )}

//         {/* -------- STEP 3: SUCCESS -------- */}
//         {step === 3 && (
//           <>
//             <h3 className="text-green-600 font-semibold text-lg">
//               ✅ Transaction Successful
//             </h3>
//             <p className="mt-2 text-sm">
//               Transaction ID:
//               <br />
//               <code>{transactionId}</code>
//             </p>

//             <button
//               onClick={() => navigate("/dashboard")}
//               className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
//             >
//               Go to Dashboard
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// }








import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../Api/axiosClient";

export default function Transfer() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");

  const [transactionId, setTransactionId] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputStyle =
    "w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";

  const primaryBtn =
    "w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50";

  const secondaryBtn =
    "w-full border border-gray-300 py-2 rounded-lg hover:bg-gray-100 transition";

  /* ---------------- CONFIRM TRANSFER ---------------- */
  const confirmTransfer = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/api/transfer", {
        fromAccountId: Number(fromAccountId),
        toAccountId: Number(toAccountId),
        amount: Number(amount),
        description
      });

      setTransactionId(res.data.transactionId);

      if (res.data.otpRequired === true) {
        setStep(3);
      } else {
        setStep(5);
      }
    } catch (e) {
      setError(e?.response?.data?.message || "Transfer failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- VERIFY OTP ---------------- */
  const verifyOtp = async () => {
    if (!otp) {
      setError("Please enter OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/api/transfer/confirm-otp", {
        transactionId,
        otp
      });
      setStep(5);
    } catch {
      setError("Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6">

        {/* STEP INDICATOR */}
        <div className="flex justify-between mb-6 text-sm text-gray-500">
          <span className={step >= 1 ? "text-blue-600 font-semibold" : ""}>Details</span>
          <span className={step >= 2 ? "text-blue-600 font-semibold" : ""}>Confirm</span>
          <span className={step >= 3 ? "text-blue-600 font-semibold" : ""}>OTP</span>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4">
            {error}
          </div>
        )}

        {/* STEP 1 */}
        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold mb-4">💸 Transfer Money</h2>

            <input
              className={inputStyle}
              placeholder="From Account ID"
              value={fromAccountId}
              onChange={e => setFromAccountId(e.target.value)}
            />

            <input
              className={inputStyle}
              placeholder="To Account ID"
              value={toAccountId}
              onChange={e => setToAccountId(e.target.value)}
            />

            <input
              className={inputStyle}
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />

            <textarea
              className={inputStyle}
              placeholder="Description"
              value={description}
              onChange={e => setDescription(e.target.value)}
            />

            <button className={primaryBtn} onClick={() => setStep(2)}>
              Next →
            </button>
          </>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold mb-4">✅ Confirm Transfer</h2>

            <div className="bg-gray-50 p-4 rounded-lg mb-4 text-sm">
              <p><b>From:</b> {fromAccountId}</p>
              <p><b>To:</b> {toAccountId}</p>
              <p><b>Amount:</b> ₹{amount}</p>
            </div>

            <div className="flex gap-3">
              <button className={secondaryBtn} onClick={() => setStep(1)}>
                Back
              </button>
              <button className={primaryBtn} onClick={confirmTransfer} disabled={loading}>
                {loading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <>
            <h2 className="text-xl font-semibold mb-4">🔐 OTP Verification</h2>

            <input
              className={inputStyle + " text-center tracking-widest"}
              placeholder="Enter OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
            />

            <button className={primaryBtn} onClick={verifyOtp} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}

        {/* STEP 5 */}
        {step === 5 && (
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-green-600 mb-4">
              ✅ Transfer Successful
            </h2>
            <button className={primaryBtn} onClick={() => navigate("/dashboard")}>
              Go to Dashboard
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
