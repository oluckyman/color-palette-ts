import type { ColorData, InputModel } from "./types";
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
  options?: {
    name?: TName;
    subtone?: SubtoneDef<TSubtone>;
  },
): Tone<TOut, TName, TSubtone> {
  const tone = ((data: ColorData) => fn(data)) as Tone<TOut, TName, TSubtone>;
  if (options?.name) tone.toneName = options.name;
  if (options?.subtone) tone.subtone = options.subtone;

  return tone;
}

export function createPalette(input: InputModel): InputModel;
export function createPalette<TBase extends (data: ColorData) => Record<string, unknown>>(
  input: InputModel,
  options: { base: TBase },
): { [K in keyof InputModel]: InputModel[K] & ReturnType<TBase> };

export function createPalette(input: InputModel, options?: { base?: (data: ColorData) => Record<string, unknown> }) {
  const out: Record<string, ColorData> = {};
  for (const key in input) {
    const k = key as keyof InputModel;
    const base = options?.base?.(input[k]);
    out[k] = { ...input[k], ...base };
  }
  return out;
}
