import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, relative } from "node:path";
import { format, resolveConfig } from "prettier";

const workspace = process.cwd();
const sourceRoot = resolve(workspace, "site");
const checkOnly = process.argv.includes("--check");
const pages = [
  ["index.template.html", "index.html"],
  ["quote.template.html", "quote/index.html"],
];

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

for (const [templatePath, outputPath] of pages) {
  const output = resolve(workspace, outputPath);
  const prettierConfig = (await resolveConfig(output)) ?? {};
  const rendered = await format(
    `${render(resolve(sourceRoot, templatePath)).trim()}\n`,
    {
      ...prettierConfig,
      filepath: output,
    },
  );
  const current = existsSync(output) ? readFileSync(output, "utf8") : null;

  if (current === rendered) {
    process.stdout.write(`${outputPath} is current.\n`);
  } else if (checkOnly) {
    throw new Error(
      `${outputPath} is stale. Run npm run build and commit the result.`,
    );
  } else {
    writeFileSync(output, rendered);
    process.stdout.write(`Built ${outputPath} from site components.\n`);
  }
}
