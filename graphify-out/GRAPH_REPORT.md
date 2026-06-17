# Graph Report - ts-prelude  (2026-06-17)

## Corpus Check
- 87 files · ~41,803 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 432 nodes · 699 edges · 33 communities (30 shown, 3 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 43 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]

## God Nodes (most connected - your core abstractions)
1. `isSome()` - 27 edges
2. `None` - 23 edges
3. `Some` - 19 edges
4. `ok` - 19 edges
5. `then()` - 14 edges
6. `r` - 14 edges
7. `err` - 13 edges
8. `Option` - 11 edges
9. `Guide for AI assistants using `@ur-wesley/ts-prelude`` - 11 edges
10. `p()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `U()` --calls--> `c()`  [INFERRED]
  scripts/bundle-out/option-only.js → coverage/prettify.js
- `B()` --calls--> `U()`  [INFERRED]
  coverage/prettify.js → scripts/bundle-out/option-only.js
- `loadRowData()` --calls--> `number()`  [INFERRED]
  coverage/sorter.js → src/config/parsers.ts
- `toResult()` --calls--> `ok`  [INFERRED]
  src/option/ops.ts → tests/interop.test.ts
- `toResult()` --calls--> `err`  [INFERRED]
  src/option/ops.ts → tests/interop.test.ts

## Communities (33 total, 3 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.09
Nodes (41): toOption(), fromArray(), fromOption(), fromResult(), first(), last(), createIterator(), fromIterable() (+33 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (41): parseBoolean(), toResult(), pipeResult(), ResultFn, sequence(), traverse(), map2(), map3() (+33 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (26): InferConfig, HandlerMap, whenMatch(), combineWithAllErrors, combineWithAllErrorsAsync, result, sum, area() (+18 more)

### Community 3 - "Community 3"
Cohesion: 0.12
Nodes (33): andTee(), andThen(), andThrough(), asyncAndThen(), asyncAndThrough(), asyncMap(), b(), e() (+25 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (29): Architecture, code:bash (bun add @ur-wesley/ts-prelude), code:ts (import {), code:ts (import { logger } from "@ur-wesley/ts-prelude/log";), code:bash (bun install), code:ts (import { some, none, fromNullable, map } from "@ur-wesley/ts), code:ts (import {), code:ts (import { ok, err, matchResult, traverse } from "@ur-wesley/t) (+21 more)

### Community 5 - "Community 5"
Cohesion: 0.2
Nodes (14): boolean(), createDef(), enum_(), number(), resolveBooleanArgs(), resolveNumberArgs(), resolveStringArgs(), string() (+6 more)

### Community 6 - "Community 6"
Cohesion: 0.12
Nodes (16): Anti-patterns (do not suggest), code:bash (bun add @ur-wesley/ts-prelude), code:ts (import { VERSION } from "@ur-wesley/ts-prelude";), code:ts (import {), code:ts (import { fromNullable } from "@ur-wesley/ts-prelude/interop"), code:mermaid (flowchart TD), Flow reference, Guide for AI assistants using `@ur-wesley/ts-prelude` (+8 more)

### Community 7 - "Community 7"
Cohesion: 0.14
Nodes (4): UserId, Brand, refine(), NonEmptyArray

### Community 8 - "Community 8"
Cohesion: 0.21
Nodes (13): apply(), ifDefined(), ifErr(), ifOk(), let_(), run(), with_(), bag (+5 more)

### Community 9 - "Community 9"
Cohesion: 0.27
Nodes (11): addSortIndicators(), enableUI(), getNthColumn(), getTable(), getTableBody(), getTableHeader(), loadColumns(), loadData() (+3 more)

### Community 11 - "Community 11"
Cohesion: 0.24
Nodes (12): AsyncDisposable, defer(), Disposable, using(), usingAsync(), usingResource(), usingResourceAsync(), cleanup (+4 more)

### Community 12 - "Community 12"
Cohesion: 0.29
Nodes (10): asyncCache, asyncTraverse(), lazyAsync(), parallel(), race(), retry(), withTimeout(), load (+2 more)

### Community 13 - "Community 13"
Cohesion: 0.35
Nodes (9): a(), B(), c(), D(), g(), i(), k(), Q() (+1 more)

### Community 14 - "Community 14"
Cohesion: 0.22
Nodes (7): id, items, ne, negative, positive, t, assertNever()

### Community 15 - "Community 15"
Cohesion: 0.2
Nodes (8): absent, falsy, invalid, one, present, result, truthy, zero

### Community 16 - "Community 16"
Cohesion: 0.31
Nodes (7): copy(), EvolveChanges, update(), updatePath(), cloned, next, src

### Community 17 - "Community 17"
Cohesion: 0.29
Nodes (5): dataMapOnly, fixturesDir, log, optionOnly, outDir

### Community 19 - "Community 19"
Cohesion: 0.7
Nodes (4): goToNext(), goToPrevious(), makeCurrent(), toggleClass()

### Community 20 - "Community 20"
Cohesion: 0.5
Nodes (3): lazy(), factory, get

### Community 22 - "Community 22"
Cohesion: 0.83
Nodes (3): i(), m(), t()

## Knowledge Gaps
- **108 isolated node(s):** `log`, `fixturesDir`, `outDir`, `optionOnly`, `dataMapOnly` (+103 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `ok` connect `Community 1` to `Community 0`, `Community 8`, `Community 7`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._
- **Why does `parseBoolean()` connect `Community 1` to `Community 5`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `number()` connect `Community 5` to `Community 9`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `None` (e.g. with `parse()` and `parse()`) actually correct?**
  _`None` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 2 inferred relationships involving `Some` (e.g. with `parse()` and `parse()`) actually correct?**
  _`Some` has 2 INFERRED edges - model-reasoned connections that need verification._
- **Are the 18 inferred relationships involving `ok` (e.g. with `parseBoolean()` and `toResult()`) actually correct?**
  _`ok` has 18 INFERRED edges - model-reasoned connections that need verification._
- **What connects `log`, `fixturesDir`, `outDir` to the rest of the system?**
  _108 weakly-connected nodes found - possible documentation gaps or missing edges._