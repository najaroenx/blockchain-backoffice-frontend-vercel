import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import PointDataTable from "@/app/dlt/components/dashboard/PointDataTable/PointDataTable";

describe("PointDataTable Component", () => {
  const defaultColumns = [
    { key: "currency", label: "Currency" },
    { key: "total", label: "Total" },
    { key: "sold", label: "Sold" },
  ];

  const defaultRows = [
    { currency: "THB", total: 5000, sold: 3000 },
    { currency: "USD", total: 200, sold: 120 },
  ];

  it("should render the table title", () => {
    render(
      <PointDataTable title="มูลค่าคูปอง (Point)" columns={defaultColumns} rows={defaultRows} />
    );
    expect(screen.getByText("มูลค่าคูปอง (Point)")).toBeInTheDocument();
  });

  it("should render column headers", () => {
    render(
      <PointDataTable title="Test Table" columns={defaultColumns} rows={defaultRows} />
    );
    expect(screen.getByText("Currency")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByText("Sold")).toBeInTheDocument();
  });

  it("should render row data", () => {
    render(
      <PointDataTable title="Test Table" columns={defaultColumns} rows={defaultRows} />
    );
    expect(screen.getByText("THB")).toBeInTheDocument();
    expect(screen.getByText("5000")).toBeInTheDocument();
    expect(screen.getByText("3000")).toBeInTheDocument();
    expect(screen.getByText("USD")).toBeInTheDocument();
    expect(screen.getByText("200")).toBeInTheDocument();
    expect(screen.getByText("120")).toBeInTheDocument();
  });

  it("should render empty state when no rows", () => {
    render(
      <PointDataTable title="Test Table" columns={defaultColumns} rows={[]} />
    );
    expect(screen.getByText("ไม่มีข้อมูล")).toBeInTheDocument();
  });

  it("should render default title when no title prop", () => {
    render(<PointDataTable columns={defaultColumns} rows={defaultRows} />);
    expect(screen.getByText("Data Table")).toBeInTheDocument();
  });

  it("should render search input", () => {
    render(
      <PointDataTable title="Test Table" columns={defaultColumns} rows={defaultRows} />
    );
    expect(screen.getByPlaceholderText("Search...")).toBeInTheDocument();
  });

  it("should render pagination buttons", () => {
    render(
      <PointDataTable title="Test Table" columns={defaultColumns} rows={defaultRows} />
    );
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("should handle missing column values with dash", () => {
    const rows = [{ currency: "THB" }]; // missing total and sold
    render(
      <PointDataTable title="Test Table" columns={defaultColumns} rows={rows} />
    );
    const dashes = screen.getAllByText("-");
    expect(dashes.length).toBe(2);
  });
});
