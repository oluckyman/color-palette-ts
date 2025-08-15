import type { ColorData, InputModel } from "./types";
export type { ColorsUnion, ColorData, InputModel } from "./types";

// Domain alias: what a tone/subtone returns (derived props for a single color).
type ToneOutput = Record<string, unknown>;
// Transformer from one ColorData to some derived props.
type ToneFn<TOut extends ToneOutput = ToneOutput> = (data: ColorData) => TOut;

type SubtoneMap = Record<string, ToneFn>;

type Tone<TOut extends ToneOutput, TName extends string, TSubtone extends SubtoneMap> = ToneFn<TOut> & {
  toneName?: TName;
  subtone?: TSubtone;
};

export function createTone<TOut extends ToneOutput, TName extends string, TSubtone extends SubtoneMap>(
  fn: ToneFn<TOut>,
  options?: {
    name?: TName;
    subtone?: TSubtone;
  },
): Tone<TOut, TName, TSubtone> {
  const tone = ((data: ColorData) => fn(data)) as Tone<TOut, TName, TSubtone>;
  if (options?.name) tone.toneName = options.name;
  if (options?.subtone) tone.subtone = options.subtone;
  return tone;
}

export function createPalette(input: InputModel): InputModel;
export function createPalette<TBase extends ToneFn>(
  input: InputModel,
  options: { base: TBase },
): { [K in keyof InputModel]: InputModel[K] & ReturnType<TBase> };

export function createPalette<TTones extends Record<string, ToneFn>>(
  input: InputModel,
  options: { tones: TTones },
): InputModel & {
  [K in `${keyof InputModel}_${Extract<keyof TTones, string>}`]: ReturnType<TTones[Extract<keyof TTones, string>]>;
};

export function createPalette(input: InputModel, options?: { base?: ToneFn; tones?: Record<string, ToneFn> }) {
  const out: Record<string, unknown> = {};
  for (const key in input) {
    const k = key as keyof InputModel;
    const base = options?.base?.(input[k]);
    out[k] = { ...input[k], ...base };

    if (options?.tones)
      for (const toneKey in options?.tones ?? {}) {
        const toneFn = options.tones[toneKey];
        out[`${key}_${toneKey}`] = toneFn(input[k]);
      }
  }
  return out;
}
