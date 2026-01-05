import api from "./axiosClient";

export const downloadMonthlyStatement = async (accountId, month) => {
  const response = await api.get("/api/statements/monthly", {
    params: { accountId, month },
    responseType: "blob"
  });
  return response.data;
};
