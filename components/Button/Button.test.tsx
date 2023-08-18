import { axe } from "jest-axe";
import { render } from "@testing-library/react";

import Button from ".";

describe("Button", () => {
  describe("when href is provided", () => {
    it("should render and pass accessibility testing", async () => {
      const { container } = render(<Button href="/">foo</Button>);
      expect(await axe(container)).toHaveNoViolations();
    });

    it("should render children", () => {
      const { getByText } = render(<Button href="/">foo</Button>);
      expect(getByText("foo")).toBeTruthy();
    });

    it("should render an anchor tag", () => {
      const { getByRole } = render(<Button href="/">foo</Button>);
      expect(getByRole("link").tagName).toBe("A");
    });

    it("should accept an onClick handler", () => {
      const onClick = jest.fn();
      const { getByRole } = render(
        <Button href="/" onClick={onClick}>
          foo
        </Button>
      );
      getByRole("link").click();
      expect(onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("when href is not provided but an onClick handler is provided", () => {
    it("should render and pass accessibility testing", async () => {
      const onClick = jest.fn();
      const { container } = render(<Button onClick={onClick}>foo</Button>);
      expect(await axe(container)).toHaveNoViolations();
    });

    it("should render children", () => {
      const onClick = jest.fn();
      const { getByText } = render(<Button onClick={onClick}>foo</Button>);
      expect(getByText("foo")).toBeTruthy();
    });

    it("should render a button tag", () => {
      const onClick = jest.fn();
      const { getByRole } = render(<Button onClick={onClick}>foo</Button>);
      expect(getByRole("button").tagName).toBe("BUTTON");
    });
  });

  describe("when href and onClick are not provided", () => {
    it("should render and pass accessibility testing", async () => {
      const { container } = render(<Button>foo</Button>);
      expect(await axe(container)).toHaveNoViolations();
    });

    it("should render children", () => {
      const { getByText } = render(<Button>foo</Button>);
      expect(getByText("foo")).toBeTruthy();
    });

    it("should render a div tag", () => {
      const { getByText } = render(<Button>foo</Button>);
      expect(getByText("foo").tagName).toBe("DIV");
    });
  });
});