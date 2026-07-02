import { describe, expect, it } from "vitest";
import { detectNavPlatform, resolveMapLinkKind, safeNavUri } from "./utils";

const UA_IPHONE =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15";
const UA_ANDROID =
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/125.0";
const UA_MAC =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15";
const UA_WINDOWS =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125.0";

describe("detectNavPlatform — device families for map-link routing", () => {
  it("detects iPhones from the UA token", () => {
    expect(detectNavPlatform(UA_IPHONE, 5)).toBe("ios");
  });

  it("detects iPads masquerading as Macs (macOS UA + multi-touch)", () => {
    // Since iPadOS 13 Safari reports a Macintosh UA; the touch-point
    // count is the only reliable tell (real Macs report 0).
    expect(detectNavPlatform(UA_MAC, 5)).toBe("ios");
  });

  it("keeps real Macs on desktop (no touch points)", () => {
    expect(detectNavPlatform(UA_MAC, 0)).toBe("desktop");
  });

  it("detects Android", () => {
    expect(detectNavPlatform(UA_ANDROID, 5)).toBe("android");
  });

  it("defaults everything else to desktop", () => {
    expect(detectNavPlatform(UA_WINDOWS, 0)).toBe("desktop");
  });
});

describe("resolveMapLinkKind — config provider × device", () => {
  it("routes auto per device: iOS → apple, Android → geo, desktop → google", () => {
    expect(resolveMapLinkKind("auto", "ios")).toBe("apple");
    expect(resolveMapLinkKind("auto", "android")).toBe("geo");
    expect(resolveMapLinkKind("auto", "desktop")).toBe("google");
  });

  it("forced providers ignore the device", () => {
    expect(resolveMapLinkKind("google", "ios")).toBe("google");
    expect(resolveMapLinkKind("google", "android")).toBe("google");
    expect(resolveMapLinkKind("apple", "android")).toBe("apple");
    expect(resolveMapLinkKind("apple", "desktop")).toBe("apple");
  });
});

describe("safeNavUri — https plus the exact geo prefix", () => {
  it("passes https URLs through", () => {
    expect(safeNavUri("https://maps.apple.com/?q=x")).toBe(
      "https://maps.apple.com/?q=x",
    );
  });

  it("passes the generated geo chooser URI through", () => {
    expect(safeNavUri("geo:0,0?q=1010%20Wien")).toBe("geo:0,0?q=1010%20Wien");
  });

  it("blocks script schemes, arbitrary geo URIs, and non-strings", () => {
    expect(safeNavUri("javascript:alert(1)")).toBe("");
    expect(safeNavUri("geo:48.2,16.3")).toBe("");
    expect(safeNavUri(null)).toBe("");
    expect(safeNavUri(42)).toBe("");
  });
});
