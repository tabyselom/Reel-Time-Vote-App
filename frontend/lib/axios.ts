import axios from "axios";

const baseURL =
  process.env.NODE_ENV === "development" ? "http://localhost:5001/api" : "/api";

export const axiosInstance = axios.create({
  baseURL,
  withCredentials: true,
});
