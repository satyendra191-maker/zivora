import { describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({ cookies: vi.fn() }));

import { hashPassword, publicUser, tokenHash, verifyPassword } from "./auth";

describe("hashPassword / verifyPassword", () => {
  it("verifies a correct password and rejects a wrong one", () => {
    const hash = hashPassword("correct-horse-8");
    expect(verifyPassword("correct-horse-8", hash)).toBe(true);
    expect(verifyPassword("wrong-password", hash)).toBe(false);
  });
  it("uses a unique salt per hash", () => {
    expect(hashPassword("same-password")).not.toBe(hashPassword("same-password"));
  });
  it("rejects malformed hashes", () => {
    expect(verifyPassword("anything", "not-a-hash")).toBe(false);
    expect(verifyPassword("anything", "")).toBe(false);
  });
});

describe("tokenHash", () => {
  it("is a deterministic 64-char hex digest", () => {
    const first = tokenHash("session-token");
    expect(first).toBe(tokenHash("session-token"));
    expect(first).toMatch(/^[0-9a-f]{64}$/);
    expect(tokenHash("other-token")).not.toBe(first);
  });
});

describe("publicUser", () => {
  it("strips the password hash", () => {
    const safe = publicUser({
      id: "u1",
      email: "a@example.com",
      password: "secret",
      name: "Asha",
      city: "Bengaluru",
      bio: "",
      age: 25,
      intent: "Friendship",
      role: "member",
      demo: false,
      incognito: false,
      adult: true,
      suspended: false,
      createdAt: new Date(),
    });
    expect(safe).not.toHaveProperty("password");
    expect(safe.email).toBe("a@example.com");
  });
});
