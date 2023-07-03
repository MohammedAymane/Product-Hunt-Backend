const express = require("express");
const cors = require("cors");

const corsOption = {
  origin: "http://localhost:4200",
};

const app = express();

// Init Midleware
app.use(cors(corsOption));
app.use(express.json({ extended: false }));

app.get("/", (req, res) => {
  res.send("API running");
});

// Define Routes
app.use("/products", require("./routes/products"));

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log("Server started on port : " + PORT);
});
