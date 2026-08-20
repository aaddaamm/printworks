import { readFileSync, writeFileSync } from "node:fs";
import { resolve, relative } from "node:path";
import { format, resolveConfig } from "prettier";

const workspace = process.cwd();
const sourceRoot = resolve(workspace, "site");
const template = resolve(sourceRoot, "index.template.html");
const output = resolve(workspace, "index.html");
const checkOnly = process.argv.includes("--check");

function render(file, ancestry = []) {
  if (ancestry.includes(file)) {
    throw new Error(
      `Circular component include: ${[...ancestry, file]
        .map((entry) => relative(sourceRoot, entry))
        .join(" -> ")}`,
    );
  }

  return readFileSync(file, "utf8").replace(
    /<!--\s*include:\s*([^<>]+?)\s*-->/g,
    (_, componentPath) => {
      const component = resolve(file, "..", componentPath.trim());
      if (!component.startsWith(`${sourceRoot}/`)) {
        throw new Error(`Component must stay inside site/: ${componentPath}`);
      }
      return render(component, [...ancestry, file]).trimEnd();
    },
  );
}

const prettierConfig = (await resolveConfig(output)) ?? {};
const rendered = await format(`${render(template).trim()}\n`, {
  ...prettierConfig,
  filepath: output,
});
const current = readFileSync(output, "utf8");

if (checkOnly) {
  if (current !== rendered) {
    throw new Error(
      "index.html is stale. Run npm run build and commit the result.",
    );
  }
  process.stdout.write("Generated homepage is current.\n");
} else if (current !== rendered) {
  writeFileSync(output, rendered);
  process.stdout.write("Built index.html from site components.\n");
} else {
  process.stdout.write("index.html is already current.\n");
}
