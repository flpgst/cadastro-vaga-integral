import axios from "axios";

import prod from "@/config/config-prod.js";
import dev from "@/config/config-dev.js";

import { getAuthToken } from "./security";

const config = process.env.NODE_ENV === "production" ? prod : dev;

const server = axios.create({
  baseURL: config.baseURL,
  timeout: 90000
});

server.interceptors.request.use(config => {
  config.headers.authorization = getAuthToken();
  return config;
});

export default server;
