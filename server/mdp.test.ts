import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("competencies router", () => {
  it("returns all 6 competencies", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.competencies.list();
    expect(result).toHaveLength(6);
    expect(result[0]).toHaveProperty("key");
    expect(result[0]).toHaveProperty("name");
    expect(result[0]).toHaveProperty("indicators");
  });

  it("each competency has 5 indicators", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.competencies.list();
    result.forEach((comp) => {
      expect(comp.indicators).toHaveLength(5);
      comp.indicators.forEach((ind, idx) => {
        expect(ind.level).toBe(idx + 1);
        expect(ind.label).toBeTruthy();
        expect(ind.description).toBeTruthy();
        expect(ind.examples.length).toBeGreaterThan(0);
      });
    });
  });

  it("returns competency by key", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.competencies.getByKey({ key: "leadership" });
    expect(result).not.toBeNull();
    expect(result?.name).toBe("Kepemimpinan");
  });

  it("returns null for unknown key", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.competencies.getByKey({ key: "unknown_key" });
    expect(result).toBeNull();
  });
});

describe("auth router", () => {
  it("returns null user when not authenticated", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });
});
