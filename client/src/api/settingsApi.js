import axios from "axios";

const API =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";

const settingsApi = axios.create({
  baseURL: `${API}/settings`,
  withCredentials: true,
});

export const getSettings = async () => {
  const response = await settingsApi.get("/");

  return response.data;
};

export const updateSettings = async (data) => {
  const response = await settingsApi.put(
    "/",
    data
  );

  return response.data;
};

export const changePassword = async (data) => {
  const response = await settingsApi.put(
    "/change-password",
    data
  );

  return response.data;
};