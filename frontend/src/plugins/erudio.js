import axios from "axios";
import config from "@/config";

import { getAuthToken, logout } from "./security";

const erudio = axios.create({
  baseURL: config.baseURLErudio,
  timeout: 90000
});

erudio.interceptors.request.use(config => {
  config.headers["JWT-Authorization"] = getAuthToken("erudio");
  return config;
});

erudio.interceptors.response.use(
  ({ data }) => data,
  error => {
    if (error.response.data.message.includes("Token")) logout();
    else throw error.response.data.message;
  }
);

export default erudio;
