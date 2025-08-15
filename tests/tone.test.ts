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
});
