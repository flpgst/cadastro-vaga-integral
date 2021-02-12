import axios from "axios";
import config from "@/config";

import { getAuthToken, logout } from "./security";

const server = axios.create({
  baseURL: config.baseURL,
  timeout: 90000
});

server.interceptors.request.use(config => {
  config.headers.authorization = getAuthToken("vaga-integral");
  return config;
});

server.interceptors.response.use(
  ({ data }) => data,
  error => {
    if (error.response.data.message.includes("Token")) logout();
    else throw error.response.data.message;
  }
);

export default server;
