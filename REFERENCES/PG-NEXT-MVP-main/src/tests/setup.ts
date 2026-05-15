import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

class ResizeObserverMock {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

vi.stubGlobal("ResizeObserver", ResizeObserverMock);

if (!window.matchMedia) {
  vi.stubGlobal(
    "matchMedia",
    (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  );
}

beforeEach(() => {
  localStorage.clear();
});
