import { axe } from "jest-axe";
import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { render } from "@testing-library/react";

import Auth from ".";

const mockSession: Session = {
  expires: "1",
  user: { name: "Test User", email: "foo@email.com" },
};

describe("Auth", () => {
  describe("when authenticated", () => {
    it("should render children", () => {
      const { getByText } = render(
        <SessionProvider session={mockSession}>
          <Auth>
            <div>foo</div>
          </Auth>
        </SessionProvider>
      );
      expect(getByText("foo")).toBeTruthy();
    });
  });

  describe("when not authenticated", () => {
    it("should render and pass accessibility testing", async () => {
      const { container } = render(
        <SessionProvider session={null}>
          <Auth>
            <div>foo</div>
          </Auth>
        </SessionProvider>
      );
      expect(await axe(container)).toHaveNoViolations();
    });

    it("should show a sign in button", () => {
      const { getByText } = render(
        <SessionProvider session={null}>
          <Auth>
            <div>foo</div>
          </Auth>
        </SessionProvider>
      );
      expect(getByText("Sign in")).toBeTruthy();
    });
  });
});
