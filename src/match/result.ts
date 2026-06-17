import { P } from "ts-pattern";
import type { Matcher } from "ts-pattern/types";
import type { Err, Ok, Result } from "neverthrow";

function resultOk<T, E = unknown>(): Matcher<Result<T, E>, Ok<T, E>> {
  return P.when((r: Result<T, E>): r is Ok<T, E> => r.isOk());
}

function resultErr<E, T = unknown>(): Matcher<Result<T, E>, Err<T, E>> {
  return P.when((r: Result<T, E>): r is Err<T, E> => r.isErr());
}

export const R = {
  ok: resultOk,
  err: resultErr,
};
