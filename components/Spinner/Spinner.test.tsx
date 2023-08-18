import { axe } from "jest-axe";
import { render } from "@testing-library/react";

import Spinner from ".";

describe("Spinner", () => {
  it("should render and pass accessibility testing", async () => {
    const { container } = render(<Spinner />);
    expect(await axe(container)).toHaveNoViolations();
  });
});
