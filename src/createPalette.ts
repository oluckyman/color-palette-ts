import type { EffectiveName, UnionToIntersection } from "./type-utils";
import type { InputModel, Tone, ToneFn, ToneOutput } from "./types";

type Palette<T extends Record<string, Tone>> = InputModel &
  UnionToIntersection<
    {
      [C in keyof InputModel]: {
        // color_toneName
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

export function createPalette<TBase extends ToneFn, TTones extends Record<string, Tone>>(
  input: InputModel,
  options: { base: TBase; tones: TTones },
): { [K in keyof InputModel]: InputModel[K] & ReturnType<TBase> } & Palette<TTones>;

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
