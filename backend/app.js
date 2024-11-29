const express = require("express");
 const dotenv = require("dotenv");
 const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

// Load env variables

dotenv.config({path: './config/config.env' });

 const app = express();

// Connect Database
 connectDB();

 // Middleware
 app.use(cors());
 app.use(bodyParser.json());

// Routes
 app.use("/api/auth", require("./routes/auth"));
 app.use("/api/tasks", require("./routes/tasks"));
 

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
