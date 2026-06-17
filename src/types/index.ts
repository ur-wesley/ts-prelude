export function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
}

export * from "./newtype.js";
export * from "./adt.js";
export * from "./non-empty.js";
export * from "./non-empty-ops.js";
