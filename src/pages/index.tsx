// pages/index.tsx
import { useEffect, useState } from "react";
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

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface FundFlow {
  name: string;
  inflow: number;
  outflow: number;
  netFlow: number;
}

export default function Home() {
  const [fundFlows, setFundFlows] = useState<FundFlow[]>([]);

  useEffect(() => {
    fetch("/api/fund-flows")
      .then((res) => res.json())
      .then((data) => setFundFlows(data.data || []));
  }, []);

  const labels = fundFlows.map((fund) => fund.name);
  const inflows = fundFlows.map((fund) => fund.inflow);
  const outflows = fundFlows.map((fund) => fund.outflow);
  const netFlows = fundFlows.map((fund) => fund.netFlow);

  const data = {
    labels,
    datasets: [
      {
        label: "ورود پول",
        data: inflows,
        backgroundColor: "rgba(75, 192, 192, 0.5)",
      },
      {
        label: "خروج پول",
        data: outflows,
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "خالص جریان",
        data: netFlows,
        backgroundColor: "rgba(54, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <div>
      <h1>نمودار ورود و خروج پول به صندوق‌های درآمد ثابت</h1>
      <Bar data={data} />
    </div>
  );
}
