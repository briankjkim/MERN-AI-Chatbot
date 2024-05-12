import express from "express";

// Set up express app
const app = express();

// Middlewares
app.use(express.json());

// Connections and listeners
app.listen(5000, () => {
  console.log("Server open and listening");
});
