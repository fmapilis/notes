import { toHaveNoViolations } from "jest-axe";
import { defaultFallbackInView } from "react-intersection-observer";

expect.extend(toHaveNoViolations);

const mockIntersectionObserver = jest.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null
});

global.IntersectionObserver = mockIntersectionObserver;

defaultFallbackInView(false);
