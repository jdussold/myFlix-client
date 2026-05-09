import { render, screen } from "@testing-library/react";
import { ErrorBoundary } from "./error-boundary";

describe("ErrorBoundary", () => {
  // React logs the caught error to console.error during the boundary test;
  // suppress it so the test output stays readable.
  let consoleSpy;
  beforeEach(() => {
    consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });
  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it("renders children when no error is thrown", () => {
    render(
      <ErrorBoundary>
        <div>safe content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText("safe content")).toBeInTheDocument();
  });

  it("renders the fallback UI when a child throws", () => {
    const Boom = () => {
      throw new Error("boom");
    };
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>
    );
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /reload/i })
    ).toBeInTheDocument();
  });
});
