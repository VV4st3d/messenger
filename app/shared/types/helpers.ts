/* eslint-disable @typescript-eslint/no-explicit-any */
export type valueOf<T extends object> = T[keyof T];
export type getTypeOfArrayElements<T extends readonly any[]> =
  T extends readonly (infer R)[] ? R : never;
