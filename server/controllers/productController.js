// server/controllers/productController.js
const Product = require("../models/Product");

// List transactions with search and pagination
exports.listTransactions = async (req, res) => {
  const { search, page = 1, perPage = 10, month } = req.query;
  const query = {};

  if (month) {
    query.$expr = { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] };
  }
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { price: { $regex: search } },
    ];
  }

  try {
    const transactions = await Product.find(query)
      .skip((page - 1) * perPage)
      .limit(parseInt(perPage));

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Statistics API
// exports.getStatistics = async (req, res) => {
//   const { month } = req.query;
//   const query = {};

//   if (month) {
//     query.dateOfSale = { $regex: `-${month}-` };
//   }

//   const totalSales = await Product.aggregate([
//     { $match: query },
//     {
//       $group: {
//         _id: null,
//         totalSaleAmount: { $sum: "$price" },
//         totalItemsSold: { $sum: 1 },
//       },
//     },
//   ]);

//   const totalNotSold = await Product.countDocuments({ ...query, sold: false });

//   res.json({
//     totalSaleAmount: totalSales[0]?.totalSaleAmount || 0,
//     totalItemsSold: totalSales[0]?.totalItemsSold || 0,
//     totalNotSold: totalNotSold,
//   });
// };
exports.getStatistics = async (req, res) => {
  const { month } = req.query;
  const query = {};

  if (month) {
    // Use $expr and $month to extract the month from the dateOfSale field
    query.$expr = { $eq: [{ $month: "$dateOfSale" }, parseInt(month)] };
  }

  try {
    // Get total sale amount and total number of sold items
    const totalSales = await Product.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalSaleAmount: { $sum: "$price" },
          totalItemsSold: { $sum: 1 },
        },
      },
    ]);

    // Get total number of not sold items
    const totalNotSold = await Product.countDocuments({
      ...query,
      sold: false,
    });

    res.json({
      totalSaleAmount: totalSales[0]?.totalSaleAmount || 0,
      totalItemsSold: totalSales[0]?.totalItemsSold || 0,
      totalNotSold: totalNotSold,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Bar chart API
exports.getBarChart = async (req, res) => {
  const { month } = req.query;
  const query = {};

  if (month) {
    query.dateOfSale = { $regex: `-${month}-` };
  }

  const priceBuckets = await Product.aggregate([
    { $match: query },
    {
      $bucket: {
        groupBy: "$price",
        boundaries: [0, 100, 200, 300, 400, 500, 600, 700, 800, 900, Infinity],
        default: "901-above",
        output: { count: { $sum: 1 } },
      },
    },
  ]);

  res.json(priceBuckets);
};

// Pie chart API
exports.getPieChart = async (req, res) => {
  const { month } = req.query;
  const query = {};

  if (month) {
    query.dateOfSale = { $regex: `-${month}-` };
  }

  const categoryDistribution = await Product.aggregate([
    { $match: query },
    { $group: { _id: "$category", count: { $sum: 1 } } },
  ]);

  res.json(categoryDistribution);
};

// Combined API
exports.getCombinedData = async (req, res) => {
  const { month } = req.query;
  const [statistics, barChart, pieChart] = await Promise.all([
    this.getStatistics(req, res),
    this.getBarChart(req, res),
    this.getPieChart(req, res),
  ]);

  res.json({
    statistics,
    barChart,
    pieChart,
  });
};
