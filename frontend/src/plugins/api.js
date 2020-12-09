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

server.interceptors.response.use(
  ({ data }) => data,
  error => {
    throw new Error(error.response.data.error).message;
  }
);

export default server;
