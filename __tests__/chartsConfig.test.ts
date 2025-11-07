import chartsConfig from "@/configs/charts-config";

describe("chartsConfig", () => {
  it("should be defined", () => {
    expect(chartsConfig).toBeDefined();
  });

  it("should disable toolbar", () => {
    expect(chartsConfig.chart.toolbar.show).toBe(false);
  });

  it("should have tooltip theme set to dark", () => {
    expect(chartsConfig.tooltip.theme).toBe("dark");
  });

  it("should disable x-axis border and ticks", () => {
    expect(chartsConfig.xaxis.axisTicks.show).toBe(false);
    expect(chartsConfig.xaxis.axisBorder.show).toBe(false);
  });

  it("should enable grid with dashed lines", () => {
    expect(chartsConfig.grid.show).toBe(true);
    expect(chartsConfig.grid.strokeDashArray).toBe(5);
  });
});
