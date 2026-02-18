import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

// Mock @lottiefiles/dotlottie-react
jest.mock("@lottiefiles/dotlottie-react", () => ({
  DotLottieReact: (props: any) => (
    <div
      data-testid="lottie-animation"
      data-src={props.src}
      data-loop={props.loop}
      data-autoplay={props.autoplay}
      className={props.className}
    >
      Lottie
    </div>
  ),
}));

import LoadingDefaultComponent from "@/app/dlt/components/LoadingDefaultComponent";

describe("LoadingDefaultComponent", () => {
  it("should render the lottie animation", () => {
    render(<LoadingDefaultComponent />);
    expect(screen.getByTestId("lottie-animation")).toBeInTheDocument();
  });

  it("should use default src when no src provided", () => {
    render(<LoadingDefaultComponent />);
    const lottie = screen.getByTestId("lottie-animation");
    expect(lottie.getAttribute("data-src")).toContain("lottie.host");
  });

  it("should use custom src when provided", () => {
    render(<LoadingDefaultComponent src="https://example.com/my.lottie" />);
    const lottie = screen.getByTestId("lottie-animation");
    expect(lottie.getAttribute("data-src")).toBe("https://example.com/my.lottie");
  });

  it("should loop by default", () => {
    render(<LoadingDefaultComponent />);
    const lottie = screen.getByTestId("lottie-animation");
    expect(lottie.getAttribute("data-loop")).toBe("true");
  });

  it("should autoplay by default", () => {
    render(<LoadingDefaultComponent />);
    const lottie = screen.getByTestId("lottie-animation");
    expect(lottie.getAttribute("data-autoplay")).toBe("true");
  });

  it("should use custom className", () => {
    render(<LoadingDefaultComponent className="w-54 h-54" />);
    const lottie = screen.getByTestId("lottie-animation");
    expect(lottie).toHaveClass("w-54 h-54");
  });

  it("should use default className when not provided", () => {
    render(<LoadingDefaultComponent />);
    const lottie = screen.getByTestId("lottie-animation");
    expect(lottie).toHaveClass("w-48 h-48");
  });

  it("should accept loop=false", () => {
    render(<LoadingDefaultComponent loop={false} />);
    const lottie = screen.getByTestId("lottie-animation");
    expect(lottie.getAttribute("data-loop")).toBe("false");
  });
});
