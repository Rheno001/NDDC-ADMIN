import { Component } from "react";
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
import { ChartOptions } from "chart.js";

// Register required Chart.js components — mandatory in Chart.js v3+
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface VendorActivityProps {
  dataActive: number;
  width?: number;
  height?: number;
}

class VendorActivity extends Component<VendorActivityProps> {
  static defaultProps = {
    width: 433,
    height: 251,
  };

  render() {
    // Day / Month / Year vendor registration data
    const activityData: number[][] = [
      // Day (Mon–Sat)
      [12, 8, 15, 10, 18, 7, 14, 9, 20, 11, 16, 6],
      // Month (Jan–Dec)
      [40, 55, 38, 62, 70, 45, 80, 65, 50, 75, 90, 83],
      // Year (2018–2025)
      [120, 145, 160, 200, 175, 220, 260, 310],
    ];

    const labels: string[][] = [
      ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
      ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
      ["2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"],
    ];

    const data = {
      labels: labels[this.props.dataActive],
      datasets: [
        {
          label: "Vendor Registrations",
          data: activityData[this.props.dataActive],
          borderColor: "rgba(77,68,181,1)",
          borderWidth: 0,
          backgroundColor: "rgba(77,68,181,0.85)",
          borderRadius: 4,
        },
      ],
    };

    const options: ChartOptions<"bar"> = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          titleColor: "#888",
          bodyColor: "#555",
          titleFont: { size: 12 },
          bodyFont: { size: 15 },
          backgroundColor: "rgba(256,256,256,0.95)",
          displayColors: true,
          padding: { x: 10, y: 7 },
          borderColor: "rgba(220,220,220,0.9)",
          borderWidth: 2,
          caretSize: 6,
          caretPadding: 10,
        },
      },
      scales: {
        y: {
          grid: { color: "rgba(89,59,219,0.1)" },
          ticks: { color: "#999" },
        },
        x: {
          grid: { display: false },
          ticks: { color: "#999" },
        },
      },
      interaction: { mode: "index", intersect: false },
    };

    return (
      <div style={{ minHeight: "290px" }}>
        <Bar
          data={data}
          width={this.props.width}
          height={this.props.height}
          options={options}
        />
      </div>
    );
  }
}

export default VendorActivity;
