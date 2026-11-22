import { createHash } from "node:crypto";
import { describe, expect, it } from "vitest";
import { docProjects, modes } from "./docs";
import { sourceDocuments } from "@jagger-ui/content/sourceDocuments";

const baseline: Record<string, string> = {
  "aixc-compressor":
    "e25779ac28a89617d9adb376f231dc20637638cc5399cc917a35fbf53cb4c428",
  "genetic-ts":
    "69bb2e47c288ded682e561ce65e35e232b13aaaaa892c240d1b40f10f3e24235",
  hearth: "99fea063478b3b9cf26e0ec05c69dd1696e1c7aeb8043492463cb2ac8ecf9963",
  jaggerscript:
    "c4361d25bb6aa43e629ce3ab66eb02e2e767d3fc7d5e0cd834b1bfa7837552a8",
  liveboard: "3c06306d094de36842bf78b9625b4b1bde27a3c1c733911f169cc92a040ab4e5",
  ojaml: "835f0df5e31c967aae07e412853f314ff209787001c97489bb0f2e69235c1c99",
  rengine: "3c6dbd028064aab5f4b43aac25fd2b56b172f0610a8091d7edf599eb8c3ad903",
  "tsxlight-renderer":
    "e230479726817bb126f61bdd698264dddc842fc1ebf3325fefd8e777c64dc506",
};

describe("documentation catalog", () => {
  it("preserves original manuscripts apart from the documented Counter syntax erratum", () => {
    for (const source of sourceDocuments) {
      const historicalSections =
        source.slug === "jaggerscript"
          ? source.sections.map((section) =>
              section.id !== "grammar"
                ? section
                : {
                    ...section,
                    blocks: section.blocks.map((block) =>
                      block.kind === "example" &&
                      block.label === "Representative program"
                        ? {
                            ...block,
                            code: block.code.replace(
                              "func next()",
                              "func number next()",
                            ),
                          }
                        : block,
                    ),
                  },
            )
          : source.sections;
      const stable = JSON.stringify(historicalSections).replace(
        /(?:\/packages\/jagger-ui\/src\/assets\/|\/src\/assets\/|\.\.\/\.\.\/assets\/)/g,
        "",
      );
      expect(
        createHash("sha256").update(stable).digest("hex"),
        source.slug,
      ).toBe(baseline[source.slug]);
      const project = docProjects.find((p) => p.source.slug === source.slug)!;
      for (const section of source.sections) {
        expect(project.pages.find((p) => p.id === section.id)?.blocks).toEqual(
          section.blocks,
        );
      }
    }
  });

  it("provides all four documentation purposes and valid internal deep links", () => {
    for (const project of docProjects) {
      expect(new Set(project.pages.map((p) => p.mode))).toEqual(new Set(modes));
      expect(new Set(project.pages.map((p) => `${p.mode}/${p.id}`)).size).toBe(
        project.pages.length,
      );
      for (const block of project.pages.flatMap((s) => s.blocks)) {
        if (block.kind !== "doc-link" || !block.href.startsWith("/")) continue;
        const [, slug, mode, id] = block.href.split("/");
        expect(
          docProjects
            .find((p) => p.source.slug === slug)
            ?.pages.some((p) => p.mode === mode && p.id === id),
          block.href,
        ).toBe(true);
      }
    }
  });
});
