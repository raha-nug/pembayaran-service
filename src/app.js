import express from "express";
import cors from "cors";
const app = express();
import pembayaranRoute from "../src/interfaces/routes/pembayaranRoute.js";

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/pembayaran", pembayaranRoute);
app.get("/", (req, res) => {
  res.send("Welcome to the Pembayaran Service API");
});

export default app;
