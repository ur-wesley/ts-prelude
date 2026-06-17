# @ur-wesley/ts-prelude

Functional prelude for TypeScript — `Option`, `Result`, pattern matching, scope utilities, and tree-shakeable data helpers. Composes [neverthrow](https://github.com/supermacro/neverthrow), [ts-pattern](https://github.com/gvergnaud/ts-pattern), and [remeda](https://remedajs.com/) without replacing them.

## Install

```bash
bun add @ur-wesley/ts-prelude
```

**AI assistants:** see [AGENTS.md](./AGENTS.md) (usage guide), [llms.txt](./llms.txt) (index), and the [Cursor skill](.cursor/skills/ts-prelude/SKILL.md) (shipped in the package).

## Subpath imports (preferred)

Each module is independently importable for optimal tree-shaking:

```ts
import { some, none, fromNullable, map } from "@ur-wesley/ts-prelude/option";
import { ok, err, traverse } from "@ur-wesley/ts-prelude/result";
import { match, R, O } from "@ur-wesley/ts-prelude/match";
import { let_, ifSome, ifOk } from "@ur-wesley/ts-prelude/scope";
import { fromArray } from "@ur-wesley/ts-prelude/iter";
import { pipe, flow } from "@ur-wesley/ts-prelude/pipe";
import { filter } from "@ur-wesley/ts-prelude/data/filter";
import { retry, withTimeout } from "@ur-wesley/ts-prelude/async";
import { usingResource, defer } from "@ur-wesley/ts-prelude/resource";
import { wire } from "@ur-wesley/ts-prelude/wire";
import { brand, assertNever } from "@ur-wesley/ts-prelude/types";
import { copy, update } from "@ur-wesley/ts-prelude/record";
import { toOption } from "@ur-wesley/ts-prelude/interop";
import { logger } from "@ur-wesley/ts-prelude/log";
import {
  defineConfig,
  string,
  number,
  boolean,
  enum_,
} from "@ur-wesley/ts-prelude/config";
```

The root export is minimal (`VERSION` only).

## Rust / Kotlin → TypeScript cookbook

### Option (Rust `Option<T>`)

```ts
import {
  some,
  none,
  fromNullable,
  map,
  andThen,
  getOrElse,
} from "@ur-wesley/ts-prelude/option";

// Rust: Some(42) / None
const x = some(42);
const empty = none();

// Rust: value.map(|n| n * 2)
map(x, (n) => n * 2);

// Rust: value.and_then(|s| parse(s))
andThen(fromNullable("hi"), (s) => (s.length > 0 ? some(s.length) : none()));

// Rust: value.unwrap_or(0)
getOrElse(empty, 0);
```

### Result (Rust `Result<T, E>` via neverthrow)

```ts
import { ok, err, matchResult, traverse } from "@ur-wesley/ts-prelude/result";

const parsed = (s: string) => (s.length > 0 ? ok(s.length) : err("empty"));

matchResult(parsed("hi"), {
  ok: (n) => `length ${n}`,
  err: (e) => `failed: ${e}`,
});

traverse(["a", "bb"], parsed); // Ok([1, 2])
```

### Pattern matching (ts-pattern + helpers)

```ts
import { match, R, O } from "@ur-wesley/ts-prelude/match";
import { ok } from "@ur-wesley/ts-prelude/result";
import { some } from "@ur-wesley/ts-prelude/option";

match(ok(1))
  .with(R.ok(), (r) => r.value)
  .with(R.err(), (r) => r.error)
  .exhaustive();

match(some("hi"))
  .with(O.some(), (o) => o.value)
  .with(O.none(), () => null)
  .exhaustive();
```

### Scope functions (Kotlin `let` / `run` / `apply` / `also` / `with`)

```ts
import {
  let_,
  run,
  apply,
  also,
  with_,
  ifSome,
  ifOk,
} from "@ur-wesley/ts-prelude/scope";
import { some } from "@ur-wesley/ts-prelude/option";
import { ok } from "@ur-wesley/ts-prelude/result";
import { logger } from "@ur-wesley/ts-prelude/log";

let_(5, (n) => n * 2); // Kotlin: 5.let { it * 2 }
run("hi", (s) => s.length); // Kotlin: run { "hi".length }
also(1, (n) => logger.info(n)); // Kotlin: 1.also { println(it) }
with_(1, 2, (a, b) => a + b); // Kotlin: with(2) { 1 + this }

ifSome(some(2), (n) => n * 2); // 4
ifOk(ok(1), (n) => n + 1); // 2
```

### Lazy iterators

```ts
import { fromArray } from "@ur-wesley/ts-prelude/iter";

fromArray([1, 2, 3, 4])
  .filter((n) => n % 2 === 0)
  .map((n) => n * 10)
  .take(1)
  .collect(); // [20]
```

### Pipe / flow

```ts
import { pipe, flow } from "@ur-wesley/ts-prelude/pipe";

pipe(
  1,
  (n) => n + 1,
  (n) => n * 2,
); // 4
flow(
  (n: number) => n + 1,
  (n) => n * 2,
)(1); // 4
```

### Composition root wiring

```ts
import { wire } from "@ur-wesley/ts-prelude/wire";
import { defineConfig, number } from "@ur-wesley/ts-prelude/config";
import { ok, err } from "@ur-wesley/ts-prelude/result";

const app = wire({
  config: () => defineConfig({ port: number(3000, { envKey: "PORT" }) }),
  db: ({ config }) => createDb(config),
  users: ({ db }) => ok(createUserRepo(db)),
});

const resolved = app.resolve();
// Result<{ config, db, users }, WireError>
```

Factories run in definition order; declare dependencies before dependents. Pass `dispose` for reverse-order cleanup.

### Config (typesafe env)

```ts
import {
  defineConfig,
  string,
  number,
  boolean,
  enum_,
} from "@ur-wesley/ts-prelude/config";
import { match, R } from "@ur-wesley/ts-prelude/match";

const config = defineConfig({
  port: number(3000, { envKey: "PORT" }),
  host: string("localhost", { envKey: "HOST" }),
  debug: boolean(false, { envKey: "DEBUG" }),
  nodeEnv: enum_(
    ["development", "production", "test"] as const,
    "development",
    { envKey: "NODE_ENV" },
  ),
});

match(config)
  .with(R.ok(), ({ value }) => value.port)
  .with(R.err(), ({ error }) => error)
  .exhaustive();
```

Schema keys are config property names; `envKey` selects which env var to read. Positional args set defaults: `number(3000)`, `string("localhost")`. Pass a custom source as the second argument to `defineConfig` for tests.

### Logging (consola)

All library logging goes through [consola](https://github.com/unjs/consola). Use `logger` for taps and side effects; `dbg` in `pipe` uses it internally.

```ts
import { logger } from "@ur-wesley/ts-prelude/log";
import { dbg, tap } from "@ur-wesley/ts-prelude/pipe";

logger.info("starting");
logger.withTag("parse").debug({ raw: "42" });

pipe(
  1,
  tap((n) => logger.info(n)),
  dbg("step"),
  (n) => n + 1,
);
```

## Development

```bash
bun install
bun run build        # tsdown — 1:1 source→dist ESM
bun test             # vitest + type tests
bun run test:coverage # vitest with 100% coverage thresholds
bun run check        # full CI gate (same as pre-push hook)
bun run prepare      # install lefthook git hooks (runs on bun install)
bun run lint         # oxlint type-aware (--type-aware --type-check via oxlint-tsgolint)
bun run lint:fix     # oxlint --fix (type-aware)
bun run format       # oxfmt
bun run format:check # oxfmt --check
bun run bundle-check # esbuild tree-shaking verification
```

### Git hooks (Lefthook)

Hooks install automatically via `bun install` (`prepare` → `lefthook install`).

| Hook           | Runs                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------ |
| **pre-commit** | `format:check`                                                                             |
| **pre-push**   | `typecheck`, `format:check`, `lint`, `test`, `build`, `bundle-check` (parallel where safe) |

Manual run: `bunx lefthook run pre-push --force --all-files` (or `bun run check`)

## Architecture

| Module     | Role                                             |
| ---------- | ------------------------------------------------ |
| `option`   | Tagged-union `Option<T>` with map/andThen        |
| `result`   | Re-exports neverthrow + traverse/sequence        |
| `match`    | Re-exports ts-pattern + `R`/`O` helpers          |
| `scope`    | Kotlin scope functions + if-let guards           |
| `iter`     | Lazy iterator combinators                        |
| `pipe`     | remeda `pipe`/`piped` + `flow`/`compose`/`dbg`   |
| `log`      | consola `logger` + `createConsola` re-export     |
| `data/*`   | One remeda function per file                     |
| `types`    | Brands, ADT tags, `NonEmptyArray`                |
| `async`    | `retry`, `withTimeout`, `race` for `ResultAsync` |
| `resource` | `defer`, `usingResource` for `Disposable`        |
| `wire`     | Typed factory graph wiring at app bootstrap      |
| `config`   | Typesafe env config via `defineConfig` + parsers |

## License

MIT
