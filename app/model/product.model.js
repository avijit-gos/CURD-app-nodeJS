const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: { type: String, require: true, unique: true, min: 3 },
  desc: { type: String, require: true },
  catagory: { type: String, require: true },
  product_image: { type: String }
},
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);