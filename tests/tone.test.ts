import { createTone } from "../src/index";
import type { ColorData } from "../src/types";

describe("createTone (runtime)", () => {
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

    const result = tone(sample);

    expect(result).toEqual({
      background: "blue",
      color: "blue",
    });
  });

  it("attaches .name when options.name is provided", () => {
    const tone = createTone((data: ColorData) => ({ background: data.main }), { name: "brightness" });

    expect(typeof tone).toBe("function");
    expect(tone.toneName).toBe("brightness");
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
    expect(tone.subtone!["low"](sample)).toEqual({ light: "blue" });
  });
});

describe("createTone (types)", () => {
  it("preserves literal type of tone name", () => {
    const tone = createTone((d: ColorData) => ({ background: d.main }), { name: "brightness" });

    expectTypeOf(tone.toneName).toEqualTypeOf<"brightness" | undefined>();
  });
});
