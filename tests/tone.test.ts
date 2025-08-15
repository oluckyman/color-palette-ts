import { createTone } from "../src/index";
import type { ColorData } from "../src/types";

describe("createTone", () => {
  it("returns a callable that applies fn(data)", () => {
    const sample: ColorData = {
      main: "blue",
      dark: "darkblue",
      light: "lightblue",
      extra: "extrablue",
    };

    const tone = createTone((data: ColorData) => ({
      background: data.main,
      color: data.main,
    }));

    expectTypeOf(tone).parameter(0).toEqualTypeOf<ColorData>();
    expectTypeOf(tone).returns.toEqualTypeOf<{ background: string; color: string }>();

    const result = tone(sample);

    expect(result).toEqual({ background: "blue", color: "blue" });
    expectTypeOf(result).toEqualTypeOf<{ background: string; color: string }>();

    expect(tone.toneName).toBeUndefined();
    expect(tone.subtone).toBeUndefined();
  });

  it("attaches .name when options.name is provided", () => {
    const tone = createTone((data: ColorData) => ({ background: data.main }), { name: "brightness" });

    expect(typeof tone).toBe("function");
    expect(tone.toneName).toBe("brightness");
    expectTypeOf(tone.toneName).toEqualTypeOf<"brightness" | undefined>();
  });

  it("exposes subtone variants as callables", () => {
    const sample: ColorData = {
      main: "blue",
      dark: "darkblue",
      light: "lightblue",
      extra: "extrablue",
    };

    const tone = createTone(
      (data) => ({
        foreground: data.main,
      }),
      {
        name: "brightness",
        subtone: { low: (data) => ({ light: data.main }) },
      },
    );

    expect(tone.subtone).toBeTruthy();
    expect(tone.subtone!.low(sample)).toEqual({ light: "blue" });

    expectTypeOf(tone.subtone!.low).parameter(0).toEqualTypeOf<ColorData>();
  });
});
