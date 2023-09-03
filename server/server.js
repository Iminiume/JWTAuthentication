const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/auth_demo";

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to the database"));

const authenticationRouter = require("./routes/authentication");
app.use("/api/authencication", authenticationRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
