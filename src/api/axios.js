import axios from "axios";
import { api } from "./index.js";

export default api;

// Legacy support: API instance (updated baseURL, no /api)
export const API = api;
