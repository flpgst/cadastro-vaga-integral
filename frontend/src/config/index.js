import prod from "@/config/config-prod.js";
import dev from "@/config/config-dev.js";

const config = process.env.NODE_ENV === "production" ? prod : dev;

export default config;
