import axios from "axios";
import config from "@/config";

import { getAuthToken } from "./security";

const server = axios.create({
  baseURL: config.baseURL,
  timeout: 90000
});

server.interceptors.request.use(config => {
  config.headers.authorization = getAuthToken();
  return config;
});

export default server;
