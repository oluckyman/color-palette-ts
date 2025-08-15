import { createPalette, createTone } from "../src/index";
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

  it("merges base tone output into each color entry", () => {
    const base = createTone((d: ColorData) => ({
      background: d.main,
    }));

    const out = createPalette(input, { base });

    expect(out.red).toEqual({ ...input.red, background: "red" });
    expect(out.green).toEqual({ ...input.green, background: "green" });
    expect(out.blue).toEqual({ ...input.blue, background: "blue" });
    expect(out.yellow).toEqual({ ...input.yellow, background: "yellow" });

    expectTypeOf(out).toMatchObjectType<InputModel>();

    type OutExpect = { [K in keyof InputModel]: ColorData & { background: string } };
    expectTypeOf(out).toEqualTypeOf<OutExpect>();
  });

  it("adds color_toneName keys with tone result", () => {
    const brightness = createTone((d: ColorData) => ({ foreground: d.main }), { name: "brightness" });
    const out = createPalette(input, { tones: { brightness } });

    expect(out.blue_brightness).toEqual({ foreground: "blue" });
    expectTypeOf(out.blue_brightness).toEqualTypeOf<ReturnType<typeof brightness>>();

    expect(out.blue).toEqual(input.blue);
    expectTypeOf(out.blue).toEqualTypeOf<ColorData>();
  });

  it("uses tone key as tone name, when there is no tone name provided", () => {
    const brightness = createTone((d: ColorData) => ({ foreground: d.main }));
    const out = createPalette(input, { tones: { darkness: brightness } });

    expect(out.blue_darkness).toEqual({ foreground: "blue" });
    expectTypeOf(out.blue_darkness).toEqualTypeOf<ReturnType<typeof brightness>>();
    // Test that type of out has no keys matching `red_*` except `red_darkness`
    type Out = typeof out;
    type HasKey<T, K extends PropertyKey> = K extends keyof T ? true : false;

    expectTypeOf<HasKey<Out, "red_darkness">>().toEqualTypeOf<true>();
    expectTypeOf<HasKey<Out, "red_brightness">>().toEqualTypeOf<false>();
  });
});
