import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:9099",
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && token!=="null" && token!=="undefined") config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;


// {
//   "accountId": 1,
//   "symbol": "AAPL",
//   "quantity": 1
// }
