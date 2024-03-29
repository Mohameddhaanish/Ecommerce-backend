const express = require("express");
const app = express();
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const dbConnection = require("./config/db");
require("dotenv").config();
dbConnection();
const authjwt = require("./helpers/jwt");
const products = require("./routes/products");
const category = require("./routes/category");
const user = require("./routes/user");
const orders = require("./routes/orders");
const upload = require("./routes/upload");
// const orderItem = require("./routes/orderItem");
const errorHandler = require("./helpers/error-handler");

app.use(cors());
app.use(express.static(path.join("public")));
app.use(express.json());
app.use(morgan("tiny"));
app.use(authjwt);
app.use(errorHandler);
app.use("/api/products", products);
app.use("/api/category", category);
app.use("/api/user", user);
app.use("/api/orders", orders);
// app.use("api/orderitem", orderItem);
app.use("/api/upload", upload);
app.use("/public/uploads/", express.static(__dirname + "/public/uploads"));
// app.use("/api/orderitem", orderItem);
app.use((req, res, next) => {
  res.status(404).send("Not Found Route");
  next();
});
app.listen(8082, () => {
  console.log(`Server is running on http://localhost:8082`);
});
console.log(__dirname);
