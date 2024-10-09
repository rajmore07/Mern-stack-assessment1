// server/routes/productRoutes.js
const express = require("express");
const router = express.Router();
const {
  listTransactions,
  getStatistics,
  getBarChart,
  getPieChart,
  getCombinedData,
} = require("../controllers/productController");

router.get("/transactions", listTransactions);
//get: http://localhost:5000/api/transactions?month=${month}
router.get("/statistics", getStatistics);
//get: http://localhost:5000/api/statistics?month=${month}
router.get("/bar-chart", getBarChart);
//get: http://localhost:5000/api/bar-chart?month=${month}
router.get("/pie-chart", getPieChart);
//get:
router.get("/combined", getCombinedData);

module.exports = router;
