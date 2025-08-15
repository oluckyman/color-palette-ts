import type { ColorData } from "./types";
export type { ColorsUnion, ColorData, InputModel } from "./types";

type Tone<TOut> = ((data: ColorData) => TOut) & { toneName?: string };

export function createTone<TOut>(fn: (data: ColorData) => TOut, opts?: { name?: string }): Tone<TOut> {
  const tone = ((data: ColorData) => fn(data)) as Tone<TOut>;
  if (opts?.name) {
    tone.toneName = opts.name;
  }
  return tone;
}
