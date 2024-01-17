require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const corsOptions = require("./config/corsOptions");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const credentials = require("./middleware/credentials");
const connectDB = require("./config/dbConnection");

//Connnect to MongoDb
connectDB();

const PORT = process.env.PORT || 3500;

//Custom middleware logger
//since we are making it so next function should be there,
//in built middleware as name suggests it is built in there
app.use(logger);

app.use(credentials);
//cross origin resource sharing

app.use(cors(corsOptions));
//built in middleware to handle urlencoded form data
//content type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));

//built in middleware for JSON
app.use(express.json());

//middleware for cookies
app.use(cookieParser());

//serve static files like css customization
app.use(express.static(path.join(__dirname, "/public")));

//means css will be applied to the following routes
//routes
app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));

//everything after this will use verifyJWT
app.use(verifyJWT);
app.use("/employees", require("./routes/api/employees"));

//Route handlers
//functions chaining together

// app.use('/') is used for middleware only and does accepts regex
//app.all is used for routing and it will apply to all http requests
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
