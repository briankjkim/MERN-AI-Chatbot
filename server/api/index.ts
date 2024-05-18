import app from "../src/app";
import { connectToMongoDB } from "../src/db/connection";

const PORT = process.env.PORT || 5000;

// Connections and listeners
connectToMongoDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server listening and connected to DB 😎");
    });
  })
  .catch((err) => console.log(err));
