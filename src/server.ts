import app from "./app.js";
import { config } from "./configs/config.js";
import { connectDB } from "./db/connectDB.js";

const startServer = () => {
  const port = config.port;

  connectDB()
    .then(() => {
      app.listen(port, () => {
        console.log(`Server is running on port http://localhost:${port}`);
      });
    })
    .catch(err => {
      console.log(" Error while connecting to database", err.message);
    });
};

startServer();
