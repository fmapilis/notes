import { axe } from "jest-axe";
import { render } from "@testing-library/react";

import Layout from ".";

describe("Layout", () => {
  it("should render and pass accessibility testing", async () => {
    const { container } = render(<Layout>foo</Layout>);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("should render children", () => {
    const { getByText } = render(<Layout>foo</Layout>);
    expect(getByText("foo")).toBeTruthy();
  });
});
