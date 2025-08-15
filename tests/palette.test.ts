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

  it("uses tone.toneName for both tone and subtone keys", () => {
    const depth = createTone((d: ColorData) => ({ background: d.light, foreground: d.main, color: d.extra }), {
      name: "depth",
      subtone: {
        "8-bit": (d) => ({ borderColor: d.main }),
        "24-bit": (d) => ({ extraColor: d.extra }),
      },
    });

    const out = createPalette(input, { tones: { depth } });

    expect(out.blue_depth).toEqual({
      background: "lightblue",
      foreground: "blue",
      color: "extrablue",
    });
    expectTypeOf(out.blue_depth).toEqualTypeOf<ReturnType<typeof depth>>();

    expect(out["blue_8-bit_depth"]).toEqual({ borderColor: "blue" });
    expect(out["blue_24-bit_depth"]).toEqual({ extraColor: "extrablue" });

    if (depth.subtone) {
      type Out8 = ReturnType<(typeof depth.subtone)["8-bit"]>;
      expectTypeOf(out["blue_8-bit_depth"]).toEqualTypeOf<Out8>();
      type Out24 = ReturnType<(typeof depth.subtone)["24-bit"]>;
      expectTypeOf(out["blue_24-bit_depth"]).toEqualTypeOf<Out24>();
    }
  });

  it("supports base + tones + subtones together", () => {
    const base = createTone((d) => ({ background: d.main }));
    const brightness = createTone((d) => ({ foreground: d.main, customProp: "#f0f0f0" }));

    const depth = createTone((d) => ({ background: d.light, foreground: d.main, color: d.extra }), {
      name: "depth",
      subtone: { "8-bit": (d) => ({ borderColor: d.main }) },
    });

    const out = createPalette(input, { base, tones: { brightness, depth } });

    expect(out.blue).toEqual({ ...input.blue, background: "blue" });
    expect(out.blue_brightness).toEqual({ foreground: "blue", customProp: "#f0f0f0" });
    expect(out["blue_8-bit_depth"]).toEqual({ borderColor: "blue" });

    expect(depth.subtone).toBeDefined();
    if (!depth.subtone) return; // type guard
    // type checks
    type BaseOut = ReturnType<typeof base>;
    type BrightOut = ReturnType<typeof brightness>;
    type Depth8 = ReturnType<(typeof depth.subtone)["8-bit"]>;

    expectTypeOf(out.blue).toEqualTypeOf<ColorData & BaseOut>();
    expectTypeOf(out.blue_brightness).toEqualTypeOf<BrightOut>();
    expectTypeOf(out["blue_8-bit_depth"]).toEqualTypeOf<Depth8>();
  });
});
