// server/seed.js
const axios = require("axios");
const mongoose = require("mongoose");
const Product = require("./models/Product");

mongoose.connect("mongodb://localhost:27017/mern-assessment", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function seedDatabase() {
  try {
    const response = await axios.get(
      "https://s3.amazonaws.com/roxiler.com/product_transaction.json"
    );
    const products = response.data;

    await Product.deleteMany(); // Clear the database
    await Product.insertMany(products); // Insert fetched data
    console.log("Database seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding the database:", error);
    process.exit(1);
  }
}

seedDatabase();
