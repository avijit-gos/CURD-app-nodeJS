require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const fileupload = require("express-fileupload");

mongoose.connect(process.env.DB_CONNECTION);
mongoose.connection.on("error", () => console.log("DB is not connected"));
mongoose.connection.on("connected", () => console.log("DB is connected"))

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(fileupload({
  useTempFiles: true
}));

app.use("/product", require("./app/route/Product.router"));
app.use((req, res, next) => {
  return res.status(404).json({ msg: "Error 404! Page not found" });
})

const port = process.env.PORT || 3010;
app.listen(port, () => console.log(`App listening at PORT: ${port}`));