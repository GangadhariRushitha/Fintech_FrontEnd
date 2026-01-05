// src/api/portfolioApi.js
import api from "./axiosClient";

export const getPortfolio = (userId) => {
  return api.get("/portfolio");
};
