// Uncomment if you get "querySrv ECONNREFUSED" when connecting to MongoDB Atlas
// require("dns").setServers(["8.8.8.8", "1.1.1.1"]);
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.get("/", (req, res) => res.redirect("/login.html"));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/petitions", require("./routes/petitions"));
app.use("/api/notifications", require("./routes/notifications"));
app.use("/api/admin", require("./routes/admin"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(process.env.PORT || 3000, () =>
      console.log("Server running on http://localhost:" + (process.env.PORT || 3000)));
  })
  .catch(console.error);
