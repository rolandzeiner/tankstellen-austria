import { describe, expect, it } from "vite-plus/test";

import { estimateCardHeight, type CardSizeFacts } from "./card-size";

const ONE: CardSizeFacts = { entityCount: 1, stationCount: 5, carCount: 0, dynamic: false };

// Expected values are the rendered heights measured at 525 px wide.
describe("estimateCardHeight", () => {
  it("counts header, sparkline, refuel tip, five stations and footer by default", () => {
    expect(estimateCardHeight({}, ONE)).toBe(650);
  });

  it("drops the sparkline when history is off or the entry is dynamic", () => {
    expect(estimateCardHeight({ show_history: false }, ONE)).toBe(498);
    expect(estimateCardHeight({}, { ...ONE, dynamic: true })).toBe(498);
  });

  it("drops only the tip when best refuel is off", () => {
    expect(estimateCardHeight({ show_best_refuel: false }, ONE)).toBe(597);
  });

  it("follows max_stations and the stations the sensor has", () => {
    const off = { show_history: false };
    expect(estimateCardHeight({ ...off, max_stations: 0 }, ONE)).toBe(173);
    expect(estimateCardHeight({ ...off, max_stations: 1 }, ONE)).toBe(238);
    expect(estimateCardHeight(off, { ...ONE, stationCount: 2 })).toBe(303);
  });

  it("subtracts a hidden header price and footer", () => {
    const off = { show_history: false };
    expect(estimateCardHeight({ ...off, hide_header_price: true }, ONE)).toBe(430);
    expect(estimateCardHeight({ ...off, hide_attribution: true }, ONE)).toBe(457);
  });

  it("adds the tab bar for more than one fuel", () => {
    expect(estimateCardHeight({ show_history: false }, { ...ONE, entityCount: 2 })).toBe(543);
  });

  it("adds car rows only when cars are shown", () => {
    const facts = { ...ONE, carCount: 2 };
    expect(estimateCardHeight({ show_history: false }, facts)).toBe(498);
    expect(estimateCardHeight({ show_history: false, show_cars: true }, facts)).toBe(602);
    expect(
      estimateCardHeight(
        {
          show_history: false,
          show_cars: true,
          show_car_fillup: false,
          show_car_consumption: false,
        },
        facts,
      ),
    ).toBe(498);
  });
});
