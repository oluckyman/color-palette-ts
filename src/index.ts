import type { ColorData } from "./types";
export type { ColorsUnion, ColorData, InputModel } from "./types";

type SubtoneMap = Record<string, (data: ColorData) => unknown>;
type SubtoneDef<T extends SubtoneMap> = {
  [K in keyof T]: (data: ColorData) => ReturnType<T[K]>;
};

type Tone<TOut, TName extends string, TSubtone extends SubtoneMap> = ((data: ColorData) => TOut) & {
  toneName?: TName;
  subtone?: SubtoneDef<TSubtone>;
};

export function createTone<TOut, TName extends string, TSubtone extends SubtoneMap>(
  fn: (data: ColorData) => TOut,
  opts?: {
    name?: TName;
    subtone?: SubtoneDef<TSubtone>;
  },
): Tone<TOut, TName, TSubtone> {
  const tone = ((data: ColorData) => fn(data)) as Tone<TOut, TName, TSubtone>;
  if (opts?.name) tone.toneName = opts.name;
  if (opts?.subtone) tone.subtone = opts.subtone;

  return tone;
}
