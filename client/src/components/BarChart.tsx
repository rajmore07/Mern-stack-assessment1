import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart = ({ month }: { month: string }) => {
  const [barData, setBarData] = useState<any>(null); // State to hold the bar chart data
  const [loading, setLoading] = useState<boolean>(true); // State to show a loader while fetching data
  const [error, setError] = useState<string | null>(null); // State to handle errors

  // Function to fetch data from the backend
  const fetchBarChart = async () => {
    setLoading(true);
    setError(null);

    try {
      // Replace the URL with your actual API endpoint
      const res = await axios.get(
        `http://localhost:5000/api/bar-chart?month=${month}`
      );
      console.log(res.data); // Log the response to verify the data

      // Create chart data structure
      const data = {
        labels: res.data.map((d: any) => d._id), // Assuming _id is the label
        datasets: [
          {
            label: "Price Range", // Dataset label
            data: res.data.map((d: any) => d.count), // Assuming count is the value
            backgroundColor: "rgba(75, 192, 192, 0.6)", // Bar color
            borderWidth: 1,
          },
        ],
      };

      // Update the state with the fetched data
      setBarData(data);
    } catch (error) {
      console.error("Error fetching bar chart data:", error);
      setError("Failed to load data. Please try again later.");
    } finally {
      setLoading(false); // Stop loading spinner
    }
  };

  // Fetch the bar chart data when the component mounts or when 'month' changes
  useEffect(() => {
    fetchBarChart();
  }, [month]);

  // Conditional rendering based on the loading state, error, or data availability
  return (
    <div className="chart-container" style={{ width: "100%", height: "400px" }}>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : barData ? (
        <Bar data={barData} height={400} width={600} />
      ) : (
        <p>No data available for the selected month.</p>
      )}
    </div>
  );
};

export default BarChart;
