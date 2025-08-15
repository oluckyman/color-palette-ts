import type { ColorData, SubtoneMap, Tone, ToneFn, ToneOutput } from "./types";

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
