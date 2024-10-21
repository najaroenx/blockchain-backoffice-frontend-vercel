import chartsConfig from "@/configs/charts-config";

export const dailySalesChart = (
  data: { months: string[]; amountTransactions: number[] },
  chartOptions: any = {}
) => {
  return {
    type: "line",
    height: chartOptions.height || 220,
    series: [
      {
        name: chartOptions.seriesName || "Txs",
        data: data.amountTransactions,
      },
    ],
    options: {
      ...chartsConfig,
      colors: chartOptions.colors || ["#0288d1"],
      stroke: {
        lineCap: "round",
      },
      markers: {
        size: 5,
      },
      xaxis: {
        ...chartsConfig.xaxis,
        categories: data.months,
      },
      yaxis: [
        {
          labels: {
            formatter: function (val: number) {
              return val.toFixed(0);
            },
          },
        },
      ],
    },
  };
};
