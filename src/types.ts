export type ColorsUnion = "red" | "green" | "blue" | "yellow";

export type ColorData = {
  main: string;
  dark: string;
  light: string;
  extra: string;
};

export type InputModel = Record<ColorsUnion, ColorData>;

export type ToneOutput = Record<string, unknown>;

export type ToneFn<TOut extends ToneOutput = ToneOutput> = (data: ColorData) => TOut;

export type SubtoneMap = Record<string, ToneFn>;

export type Tone<
  TOut extends ToneOutput = ToneOutput,
  TName extends string = string,
  TSubtone extends SubtoneMap = SubtoneMap,
> = ToneFn<TOut> & {
  toneName?: TName;
  subtone?: TSubtone;
};
