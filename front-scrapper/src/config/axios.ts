import axios from "axios";

const baseURL = process.env.API_BASE_URL || "http://127.0.0.1:8000/api/v1";

const axiosInstance = axios.create({
  baseURL: baseURL,  // Ajoute la baseURL ici!
  headers: {
    "Content-Type": "application/json",
  }
});

export default axiosInstance;

