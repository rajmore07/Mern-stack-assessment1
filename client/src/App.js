// client/src/App.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./App.css";

// Register components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const App = () => {
  const [month, setMonth] = useState("03"); // Default to March
  const [transactions, setTransactions] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [barData, setBarData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, [month]);

  const fetchAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      await fetchTransactions();
      await fetchStatistics();
      await fetchBarChart();
    } catch (err) {
      setError("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/transactions?month=${month}`
      );
      setTransactions(res.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  };

  const fetchStatistics = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/statistics?month=${month}`
      );
      setStatistics(res.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
      throw error;
    }
  };

  const fetchBarChart = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/bar-chart?month=${month}`
      );
      const data = {
        labels: res.data.map((d) => d._id),
        datasets: [
          {
            label: "Price Range",
            data: res.data.map((d) => d.count),
            backgroundColor: "rgba(75, 192, 192, 0.6)",
          },
        ],
      };
      setBarData(data);
    } catch (error) {
      console.error("Error fetching bar chart data:", error);
      throw error;
    }
  };

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="container">
      <h1>MERN Stack Assessment</h1>

      {/* Search Bar and Month Selector */}
      <div className="search-container">
        <button className="search-btn">Search Transaction</button>
        <select
          className="month-dropdown"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          {[...Array(12).keys()].map((m) => (
            <option key={m + 1} value={String(m + 1).padStart(2, "0")}>
              {new Date(0, m).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
      </div>

      {/* Transactions Table */}
      <h2>Transactions</h2>
      <table className="transactions-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Sold</th>
            <th>Image</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <tr key={t._id}>
              <td>{t._id}</td>
              <td>{t.title}</td>
              <td>{t.description}</td>
              <td>{t.price}</td>
              <td>{t.category}</td>
              <td>{t.sold ? "Yes" : "No"}</td>
              <td>
                <img src={t.imageUrl} alt={t.title} width="50" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Statistics Section */}
      {statistics && (
        <div className="statistics-container">
          <h2>
            Statistics -{" "}
            {new Date(0, parseInt(month) - 1).toLocaleString("default", {
              month: "long",
            })}
          </h2>
          <div className="stats-box">
            <p>Total Sale: {statistics.totalSaleAmount}</p>
            <p>Total Sold Items: {statistics.totalItemsSold}</p>
            <p>Total Not Sold Items: {statistics.totalNotSold}</p>
          </div>
        </div>
      )}

      {/* Bar Chart */}
      {barData && (
        <div className="chart-container">
          <h2>
            Bar Chart Stats -{" "}
            {new Date(0, parseInt(month) - 1).toLocaleString("default", {
              month: "long",
            })}
          </h2>
          <Bar data={barData} />
        </div>
      )}
    </div>
  );
};

export default App;
