import axios from "axios";

const API =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const transactionApi = axios.create({
  baseURL: `${API}/transact`,
  withCredentials: true,
});


// ======================
// GET TRANSACTIONS
// ======================
export const fetchTransactions = async () => {
  const response = await transactionApi.get("/transactions");

  return response.data;
};


// ======================
// CREATE TRANSACTION
// ======================
export const createTransaction = async (transactionData) => {
  const response = await transactionApi.post(
    "/create",
    transactionData
  );

  return response.data;
};