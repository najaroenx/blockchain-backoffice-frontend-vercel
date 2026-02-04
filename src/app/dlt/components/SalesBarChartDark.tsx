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
  Legend,
);
interface BarChartProps {
  label?: string;
  labels?: string[];
  values?: number[];
}
export default function SalesBarChartDark({
  label = "Token",
  labels = ["26 Feb", "29 Feb", "1 Mar", "2 Mar", "3 Mar", "4 Mar"],
  values = [45, 55, 85, 40, 70, 35],
}: BarChartProps) {
  const data = {
    labels: labels,
    datasets: [
      {
        label: label,
        data: values,
        backgroundColor: [
          "#8b5cf6", // solid purple
          "#a78bfa", // light purple
          pattern.draw("diagonal", "#c4b5fd", "#374151"), // diagonal stripes with dark bg
          "#7c3aed", // dark purple
          "#f472b6", // pink
          pattern.draw("line", "#a78bfa", "#374151"), // horizontal stripes with dark bg
        ],
        borderRadius: {
          topLeft: 12,
          topRight: 12,
          bottomLeft: 0,
          bottomRight: 0,
        },
        maxBarThickness: 50,
        barPercentage: 0.7,
        categoryPercentage: 0.9,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 0,
        right: 0,
      },
    },
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: "#6b7280",
          font: { size: 10 },
          maxRotation: 45,
          minRotation: 0,
        },
        offset: true,
      },
      y: {
        display: false,
        grid: { display: false },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="w-full h-full min-h-[200px]">
      <Bar data={data} options={options} />
    </div>
  );
}
