import axios from "axios";

const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const budgetApi = axios.create({
  baseURL: `${API}/budgets`,
  withCredentials: true,
});

export const getBudgets = async () => {
  const response = await budgetApi.get("/");
  return response.data;
};

export const createBudget = async (data) => {
  const response = await budgetApi.post("/", data);
  return response.data;
};

export const updateBudget = async ({ id, limit }) => {
  const response = await budgetApi.put(`/${id}`, { limit });
  return response.data;
};

export const deleteBudget = async (id) => {
  const response = await budgetApi.delete(`/${id}`);
  return response.data;
};