import { consola } from "consola";
import { build } from "esbuild";
import { readFileSync, writeFileSync, mkdirSync, rmSync } from "node:fs";
import { join } from "node:path";

const log = consola.withTag("bundle-check");
const root = import.meta.dirname;
const fixturesDir = join(root, "bundle-fixtures");
const outDir = join(root, "bundle-out");

rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });
mkdirSync(fixturesDir, { recursive: true });

const optionOnly = join(fixturesDir, "option-only.ts");
const dataMapOnly = join(fixturesDir, "data-map-only.ts");

writeFileSync(
  optionOnly,
  `import { some, map } from "../../dist/option/index.js";\nvoid map(some(1), (n) => n + 1);\n`,
);
writeFileSync(
  dataMapOnly,
  `import { map } from "../../dist/data/map.js";\nvoid map([1, 2], (n) => n * 2);\n`,
);

async function bundleSize(entry: string, outfile: string): Promise<number> {
  await build({
    entryPoints: [entry],
    outfile,
    bundle: true,
    format: "esm",
    platform: "node",
    minify: true,
    treeShaking: true,
    external: [],
  });
  return readFileSync(outfile).length;
}

const optionSize = await bundleSize(optionOnly, join(outDir, "option-only.js"));
const dataMapSize = await bundleSize(
  dataMapOnly,
  join(outDir, "data-map-only.js"),
);

log.info(`option-only bundle: ${optionSize} bytes`);
log.info(`data/map-only bundle: ${dataMapSize} bytes`);

if (optionSize > 200_000) {
  log.error("option subpath bundle too large — tree-shaking may be broken");
  process.exit(1);
}

if (dataMapSize > 150_000) {
  log.error("data/map subpath bundle too large — tree-shaking may be broken");
  process.exit(1);
}

log.success("subpath bundles are within expected size limits");
