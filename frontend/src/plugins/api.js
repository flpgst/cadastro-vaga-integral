import axios from "axios";

import config from "@/config";

const server = axios.create({
  baseURL: config.baseURL,
  timeout: 90000
});

server.interceptors.request.use(config => {
  config.headers.authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NjI5MjIsImlhdCI6MTYwNjUwNDg4MywiZXhwIjoxNjA3MTA5NjgzfQ.YepdRHncTbtorOX2N6Y4jNx-j6X3FiQFfKwFboiZKY4`;
  return config;
});

export default server;
