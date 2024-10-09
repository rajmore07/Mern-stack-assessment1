// server/models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  category: String,
  dateOfSale: Date,
  sold: Boolean,
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
