import { describe, expect, it, vi } from "vitest";
import { fetchApiMaintenance } from "./api-status";

describe("fetchApiMaintenance — the card's E-Control maintenance probe", () => {
  it("sends the api_status command", async () => {
    const callWS = vi.fn().mockResolvedValue({ maintenance: false });
    await fetchApiMaintenance({ callWS });
    expect(callWS).toHaveBeenCalledWith({
      type: "tankstellen_austria/api_status",
    });
  });

  it("reports maintenance when the backend says so", async () => {
    const callWS = vi.fn().mockResolvedValue({ maintenance: true });
    expect(await fetchApiMaintenance({ callWS })).toBe(true);
  });

  it("stays quiet when the flag is false or missing", async () => {
    expect(
      await fetchApiMaintenance({
        callWS: vi.fn().mockResolvedValue({ maintenance: false }),
      }),
    ).toBe(false);
    expect(
      await fetchApiMaintenance({ callWS: vi.fn().mockResolvedValue({}) }),
    ).toBe(false);
  });

  it("stays quiet on an older backend without the command", async () => {
    // HA rejects an unknown WS type; the card must not surface that.
    const callWS = vi.fn().mockRejectedValue({ code: "unknown_command" });
    expect(await fetchApiMaintenance({ callWS })).toBe(false);
  });
});
