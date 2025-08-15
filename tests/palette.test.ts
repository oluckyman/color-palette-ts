import { createPalette } from "../src/index";
import type { InputModel, ColorData } from "../src/types";

describe("createPalette", () => {
  const input: InputModel = {
    red: { main: "red", dark: "darkred", light: "lightred", extra: "extrared" },
    green: { main: "green", dark: "darkgreen", light: "lightgreen", extra: "extragreen" },
    blue: { main: "blue", dark: "darkblue", light: "lightblue", extra: "extrablue" },
    yellow: { main: "yellow", dark: "darkyellow", light: "lightyellow", extra: "extrayellow" },
  };

  it("returns a fresh object equal to input", () => {
    const out = createPalette(input);
    expect(out).toEqual(input);
    // but not the same reference
    expect(out).not.toBe(input);
    expect(out.blue).not.toBe(input.blue);

    expectTypeOf(out).toEqualTypeOf<InputModel>();
    expectTypeOf(out.blue).toEqualTypeOf<ColorData>();
  });
});
