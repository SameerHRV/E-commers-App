import { config as dotenvConfig } from "dotenv";
dotenvConfig({
  path: "../.env",
});

const _config = {
  port: process.env.PORT || 5000,
};

export const config = Object.freeze(_config);
