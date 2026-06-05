export const topBranchTransaction = {
  height: 350,
  type: "treemap",
  series: [
    {
      data: [
        {
          x: "New Delhi",
          y: 999,
        },
        {
          x: "Kolkata",
          y: 149,
        },
        {
          x: "Mumbai",
          y: 184,
        },
        {
          x: "Ahmedabad",
          y: 55,
        },
        {
          x: "Bangaluru",
          y: 84,
        },
        {
          x: "Pune",
          y: 31,
        },
        {
          x: "Chennai",
          y: 99,
        },
      ],
    },
  ],
  options: {
    plotOptions: {
      treemap: {
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 100,
              color: "#CD363A",
            },
            {
              from: 101,
              to: 1000,
              color: "#52B12C",
            },
          ],
        },
      },
    },
  },
};
