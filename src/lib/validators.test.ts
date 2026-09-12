import { describe, expect, it } from "vitest";
import { ApiError, leadStatus, num, rangeDays, text } from "./validators";

describe("text", () => {
  it("trims and returns valid input", () => {
    expect(text("  hello  ")).toBe("hello");
  });
  it("rejects empty input when required", () => {
    expect(() => text("   ")).toThrow(ApiError);
    expect(() => text(undefined)).toThrow(ApiError);
    expect(() => text(123)).toThrow(ApiError);
  });
  it("allows empty input when optional", () => {
    expect(text("", 500, false)).toBe("");
    expect(text(undefined, 500, false)).toBe("");
  });
  it("rejects input longer than max", () => {
    expect(() => text("abc", 2)).toThrow(ApiError);
    expect(text("ab", 2)).toBe("ab");
  });
  it("carries status 400 by default", () => {
    try {
      text("");
      expect.unreachable();
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError);
      expect((e as ApiError).status).toBe(400);
    }
  });
});

describe("num", () => {
  it("accepts integers within range including boundaries", () => {
    expect(num(18, 18, 100)).toBe(18);
    expect(num(100, 18, 100)).toBe(100);
    expect(num("25", 18, 100)).toBe(25);
  });
  it("rejects out-of-range values", () => {
    expect(() => num(17, 18, 100)).toThrow(ApiError);
    expect(() => num(101, 18, 100)).toThrow(ApiError);
  });
  it("rejects non-integers and non-numbers", () => {
    expect(() => num(25.5, 18, 100)).toThrow(ApiError);
    expect(() => num(Number.NaN, 18, 100)).toThrow(ApiError);
    expect(() => num("abc", 18, 100)).toThrow(ApiError);
    expect(() => num(undefined, 18, 100)).toThrow(ApiError);
  });
});

describe("ApiError", () => {
  it("supports custom status codes", () => {
    expect(new ApiError("nope", 403).status).toBe(403);
    expect(new ApiError("nope").status).toBe(400);
  });
});

describe("rangeDays", () => {
  it("falls back when empty", () => {
    expect(rangeDays(undefined)).toBe(30);
    expect(rangeDays(null)).toBe(30);
    expect(rangeDays("")).toBe(30);
  });
  it("accepts in-range values", () => {
    expect(rangeDays(7)).toBe(7);
    expect(rangeDays("90")).toBe(90);
    expect(rangeDays(365)).toBe(365);
  });
  it("rejects out-of-range values", () => {
    expect(() => rangeDays(0)).toThrow(ApiError);
    expect(() => rangeDays(366)).toThrow(ApiError);
    expect(() => rangeDays("abc")).toThrow(ApiError);
  });
});

describe("leadStatus", () => {
  it("accepts known statuses", () => {
    expect(leadStatus("new")).toBe("new");
    expect(leadStatus("converted")).toBe("converted");
  });
  it("rejects unknown statuses", () => {
    expect(() => leadStatus("vip")).toThrow(ApiError);
    expect(() => leadStatus("")).toThrow(ApiError);
    expect(() => leadStatus(undefined)).toThrow(ApiError);
  });
});
