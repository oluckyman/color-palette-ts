import { createPalette, createTone } from "../src/index";
import type { InputModel } from "../src/types";

describe("ACCEPTANCE SNAPSHOT — matches the spec Output", () => {
  it("reproduces the expected object for input + base + brightness + depth(+subtones)", () => {
    const input: InputModel = {
      red: { main: "red", dark: "darkred", light: "lightred", extra: "extrared" },
      green: { main: "green", dark: "darkgreen", light: "lightgreen", extra: "extragreen" },
      blue: { main: "blue", dark: "darkblue", light: "lightblue", extra: "extrablue" },
      yellow: { main: "yellow", dark: "darkyellow", light: "lightyellow", extra: "extrayellow" },
    };

    const baseColors = createTone((data) => ({
      background: data.main,
      color: data.main,
    }));

    const brightness = createTone(
      (data) => ({
        foreground: data.main,
        customProp: "#f0f0f0",
      }),
      {
        name: "brightness",
        subtone: {
          low: (data) => ({ white: data.light }),
          medium: (data) => ({ shadow: data.main }),
          high: (data) => ({
            someProp: "transparent",
            anotherProp: "#fff",
            thirdCustomProp: data.main,
          }),
          ultra: (data) => ({ intensive: data.extra }),
        },
      },
    );

    // depth tone (variable name differs, toneName is 'depth' to match spec)
    const depths = createTone(
      (data) => ({
        background: data.light,
        foreground: data.main,
        color: data.extra,
      }),
      {
        name: "depth",
        subtone: {
          "8-bit": (data) => ({ borderColor: data.main }),
          "16-bit": (data) => ({ borderColor: data.main, anotherColor: data.light }),
          "24-bit": (data) => ({ extraColor: data.extra }),
        },
      },
    );

    const out = createPalette(input, { base: baseColors, tones: { brightness, depths } });

    // === SNAPSHOT (must match the spec exactly) ===
    expect(out).toEqual({
      red: { main: "red", dark: "darkred", light: "lightred", extra: "extrared", background: "red", color: "red" },
      green: {
        main: "green",
        dark: "darkgreen",
        light: "lightgreen",
        extra: "extragreen",
        background: "green",
        color: "green",
      },
      blue: {
        main: "blue",
        dark: "darkblue",
        light: "lightblue",
        extra: "extrablue",
        background: "blue",
        color: "blue",
      },
      yellow: {
        main: "yellow",
        dark: "darkyellow",
        light: "lightyellow",
        extra: "extrayellow",
        background: "yellow",
        color: "yellow",
      },

      red_brightness: { foreground: "red", customProp: "#f0f0f0" },
      red_low_brightness: { white: "lightred" },
      red_medium_brightness: { shadow: "red" },
      red_high_brightness: { someProp: "transparent", anotherProp: "#fff", thirdCustomProp: "red" },
      red_ultra_brightness: { intensive: "extrared" },

      green_brightness: { foreground: "green", customProp: "#f0f0f0" },
      green_low_brightness: { white: "lightgreen" },
      green_medium_brightness: { shadow: "green" },
      green_high_brightness: { someProp: "transparent", anotherProp: "#fff", thirdCustomProp: "green" },
      green_ultra_brightness: { intensive: "extragreen" },

      blue_brightness: { foreground: "blue", customProp: "#f0f0f0" },
      blue_low_brightness: { white: "lightblue" },
      blue_medium_brightness: { shadow: "blue" },
      blue_high_brightness: { someProp: "transparent", anotherProp: "#fff", thirdCustomProp: "blue" },
      blue_ultra_brightness: { intensive: "extrablue" },

      yellow_brightness: { foreground: "yellow", customProp: "#f0f0f0" },
      yellow_low_brightness: { white: "lightyellow" },
      yellow_medium_brightness: { shadow: "yellow" },
      yellow_high_brightness: { someProp: "transparent", anotherProp: "#fff", thirdCustomProp: "yellow" },
      yellow_ultra_brightness: { intensive: "extrayellow" },

      red_depth: { background: "lightred", foreground: "red", color: "extrared" },
      "red_8-bit_depth": { borderColor: "red" },
      "red_16-bit_depth": { borderColor: "red", anotherColor: "lightred" },
      "red_24-bit_depth": { extraColor: "extrared" },

      green_depth: { background: "lightgreen", foreground: "green", color: "extragreen" },
      "green_8-bit_depth": { borderColor: "green" },
      "green_16-bit_depth": { borderColor: "green", anotherColor: "lightgreen" },
      "green_24-bit_depth": { extraColor: "extragreen" },

      blue_depth: { background: "lightblue", foreground: "blue", color: "extrablue" },
      "blue_8-bit_depth": { borderColor: "blue" },
      "blue_16-bit_depth": { borderColor: "blue", anotherColor: "lightblue" },
      "blue_24-bit_depth": { extraColor: "extrablue" },

      yellow_depth: { background: "lightyellow", foreground: "yellow", color: "extrayellow" },
      "yellow_8-bit_depth": { borderColor: "yellow" },
      "yellow_16-bit_depth": { borderColor: "yellow", anotherColor: "lightyellow" },
      "yellow_24-bit_depth": { extraColor: "extrayellow" },
    });
  });
});
