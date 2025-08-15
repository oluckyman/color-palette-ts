import type { ColorData, InputModel } from "./types";
export type { ColorsUnion, ColorData, InputModel } from "./types";

// helpers
//
type NameOf<T> = T extends { toneName?: infer N } ? Extract<N, string> : never;
// If tone has a specific name, use it; if it's missing, fall back to the map key K
type EffectiveName<TTone, K extends string> = [NameOf<TTone>] extends [never] // no toneName property or undefined in type
  ? K
  : string extends NameOf<TTone> // toneName is the broad `string`
    ? K
    : NameOf<TTone>;
// union -> intersection utility
type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (x: infer I) => void ? I : never;

// common types
//
// Domain alias: what a tone/subtone returns (derived props for a single color).
type ToneOutput = Record<string, unknown>;
// Transformer from one ColorData to some derived props.
type ToneFn<TOut extends ToneOutput = ToneOutput> = (data: ColorData) => TOut;
type SubtoneMap = Record<string, ToneFn>;
type Tone<
  TOut extends ToneOutput = ToneOutput,
  TName extends string = string,
  TSubtone extends SubtoneMap = SubtoneMap,
> = ToneFn<TOut> & {
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

// --- createPalette ---

type Palette<T extends Record<string, Tone>> = InputModel &
  UnionToIntersection<
    {
      [C in keyof InputModel]: {
        // color_toneName
        // if value.toneName is a literal -> use it; else use the map key K
        [K in Extract<keyof T, string> as `${C}_${EffectiveName<T[K], K>}`]: ReturnType<T[K]>;
      } &
        // color_subtone_toneName
        UnionToIntersection<
          {
            [K in Extract<keyof T, string>]: T[K] extends Tone<any, any, infer S>
              ? {
                  [SK in Extract<keyof S, string> as `${C}_${SK}_${EffectiveName<T[K], K>}`]: ReturnType<S[SK]>;
                }
              : {};
          }[Extract<keyof T, string>]
        >;
    }[keyof InputModel]
  >;

export function createPalette(input: InputModel): InputModel;

export function createPalette<TBase extends ToneFn>(
  input: InputModel,
  options: { base: TBase },
): { [K in keyof InputModel]: InputModel[K] & ReturnType<TBase> };

export function createPalette<TTones extends Record<string, Tone>>(
  input: InputModel,
  options: { tones: TTones },
): Palette<TTones>;

export function createPalette(input: InputModel, options?: { base?: ToneFn; tones?: Record<string, Tone> }) {
  const out: ToneOutput = {};
  for (const key in input) {
    const k = key as keyof InputModel;
    const base = options?.base?.(input[k]);
    out[k] = { ...input[k], ...base };

    if (options?.tones)
      for (const toneKey in options?.tones ?? {}) {
        const tone = options.tones[toneKey];
        const name = tone.toneName ?? toneKey;
        out[`${key}_${name}`] = tone(input[k]);

        if (tone.subtone) {
          for (const subtoneKey in tone.subtone) {
            out[`${key}_${subtoneKey}_${name}`] = tone.subtone[subtoneKey](input[k]);
          }
        }
      }
  }
  return out;
}
