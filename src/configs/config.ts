import { config as dotenvConfig } from "dotenv";
dotenvConfig({
  path: "./.env",
});

const _config = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV,
  mongoDB: {
    uri: process.env.MONGODB_URI,
    databaseName: process.env.MONGODB_DATABASE_NAME,
  },
};

export const config = Object.freeze(_config);
