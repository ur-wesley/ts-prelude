import { P } from "ts-pattern";
import type { Matcher } from "ts-pattern/types";
import type { None, Some } from "../option/types.js";

function optionSome<T>(): Matcher<Some<T> | None, Some<T>> {
  return P.when(
    (v: unknown): v is Some<T> =>
      typeof v === "object" &&
      v !== null &&
      "_tag" in v &&
      (v as Some<T>)._tag === "Some",
  );
}

function optionNone(): Matcher<None, None> {
  return P.when(
    (v: unknown): v is None =>
      typeof v === "object" &&
      v !== null &&
      "_tag" in v &&
      (v as None)._tag === "None",
  );
}

export const O = {
  some: optionSome,
  none: optionNone,
};
