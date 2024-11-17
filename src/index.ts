import express from "express";
require("dotenv").config();
const cors = require("cors");

const app = express();
const mainRouter = require("./routes/main");
const port = process.env.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST"],
  })
);
app.use(express.json());
app.use(require("cookie-parser")());

app.use("/api/v1", mainRouter);

app.listen(port, () => {
  console.log(`Vastu Backend Running on port ${port} `);
});
