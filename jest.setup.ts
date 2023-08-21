import { toHaveNoViolations } from "jest-axe";
import { defaultFallbackInView } from "react-intersection-observer";

// Add axe to jest
expect.extend(toHaveNoViolations);

// Mock IntersectionObserver for next/link
const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});

global.IntersectionObserver = mockIntersectionObserver;

defaultFallbackInView(false);

// Mock next/router
const pushMock = jest.fn();
const reloadMock = jest.fn();

const mockUseRouter = () => ({
  query: {},
  push: pushMock,
  reload: reloadMock,
});

jest.mock("next/router", () => ({
  useRouter: mockUseRouter,
}));
