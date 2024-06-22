import app from "./app.js";
import { config } from "./configs/config.js";

const startServer = () => {
  const port = config.port;
  app.listen(port, () => {
    console.log(` 🚩 Express Server is running on port http://localhost:${port}`);
  });
};

startServer();
