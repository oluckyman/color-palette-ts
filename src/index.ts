import type { ColorData } from "./types";
export type { ColorsUnion, ColorData, InputModel } from "./types";

export function createTone<TOut>(fn: (data: ColorData) => TOut) {
  return (data: ColorData) => fn(data);
}
