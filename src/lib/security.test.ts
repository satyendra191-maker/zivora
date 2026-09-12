import { afterEach, describe, expect, it, vi } from "vitest";
import { withinRateLimit } from "./security";

afterEach(() => {
  vi.useRealTimers();
});

describe("withinRateLimit", () => {
  it("allows up to the maximum then blocks", () => {
    const key = `test-max-${Math.random()}`;
    expect(withinRateLimit(key, 3, 60000)).toBe(true);
    expect(withinRateLimit(key, 3, 60000)).toBe(true);
    expect(withinRateLimit(key, 3, 60000)).toBe(true);
    expect(withinRateLimit(key, 3, 60000)).toBe(false);
    expect(withinRateLimit(key, 3, 60000)).toBe(false);
  });
  it("tracks keys independently", () => {
    const a = `test-a-${Math.random()}`;
    const b = `test-b-${Math.random()}`;
    expect(withinRateLimit(a, 1, 60000)).toBe(true);
    expect(withinRateLimit(a, 1, 60000)).toBe(false);
    expect(withinRateLimit(b, 1, 60000)).toBe(true);
  });
  it("resets after the window expires", () => {
    vi.useFakeTimers();
    const key = `test-window-${Math.random()}`;
    expect(withinRateLimit(key, 1, 1000)).toBe(true);
    expect(withinRateLimit(key, 1, 1000)).toBe(false);
    vi.advanceTimersByTime(1001);
    expect(withinRateLimit(key, 1, 1000)).toBe(true);
  });
});
