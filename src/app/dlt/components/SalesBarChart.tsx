"use client";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import pattern from "patternomaly";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function SalesBarChart() {
  const data = {
    labels: ["26 Feb", "29 Feb", "1 Mar", "2 Mar", "3 Mar", "4 Mar"],
    datasets: [
      {
        label: "Sales",
        data: [45, 55, 85, 40, 70, 35],
        backgroundColor: [
          "#8b5cf6", // solid purple
          "#c4b5fd", // lavender
          pattern.draw("diagonal", "#a78bfa"), // diagonal stripes
          "#7c3aed", // dark purple
          "#f472b6", // pink
          pattern.draw("line", "#8b5cf6"), // horizontal stripes
        ],
        borderRadius: {
          topLeft: 12,
          topRight: 12,
          bottomLeft: 0,
          bottomRight: 0,
        },
        barThickness: 50,
        maxBarThickness: 40,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: { color: "#9ca3af", font: { size: 11 } },
      },
      y: {
        display: false,
        grid: { display: false },
      },
    },
  };

  return <Bar data={data} options={options} />;
}
