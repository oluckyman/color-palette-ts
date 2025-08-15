export type NameOf<T> = T extends { toneName?: infer N } ? Extract<N, string> : never;
//
// If tone has a specific name, use it; if it's missing, fall back to the map key K
export type EffectiveName<TTone, K extends string> = [NameOf<TTone>] extends [never] // no toneName property or undefined in type
  ? K
  : string extends NameOf<TTone> // toneName is the broad `string`
    ? K
    : NameOf<TTone>;

// union -> intersection utility
export type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (x: infer I) => void ? I : never;
