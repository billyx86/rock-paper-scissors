import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(here, "..");
const html = readFileSync(path.join(root, "index.html"), "utf8");

test("has a responsive viewport meta tag", () => {
    const m = html.match(/<meta[^>]*name=["']viewport["'][^>]*>/i);
    assert.ok(m, "no viewport meta tag found");
    assert.match(m[0], /width=device-width/i, "viewport is not width=device-width");
});

test("score and result divs are announced to screen readers (aria-live)", () => {
    for (const id of ["score", "result-out"]) {
        const m = html.match(new RegExp(`<div[^>]*id=["']${id}["'][^>]*>`, "i"));
        assert.ok(m, `div#${id} not found`);
        assert.ok(
            /\baria-live=["'](polite|assertive)["']/.test(m[0]),
            `div#${id} is filled by JS but has no aria-live, so screen readers never hear it`
        );
    }
});

test("no duplicate ids", () => {
    const ids = [...html.matchAll(/\bid=["']([^"']+)["']/gi)].map((m) => m[1]);
    const seen = new Set();
    const dupes = ids.filter((id) => (seen.has(id) ? true : (seen.add(id), false)));
    assert.deepEqual(dupes, [], `duplicate ids: ${dupes.join(", ")}`);
});

test("no stray text characters render around the game buttons", () => {
    const start = html.indexOf('<div class="buttons">');
    assert.ok(start !== -1, 'buttons container (class="buttons") not found');
    const end = html.indexOf('id="score"', start);
    assert.ok(end !== -1, 'score div not found after the buttons block');
    const block = html.slice(start, end);
    // Strip the tags; what's left is the text a visitor actually sees.
    const visibleText = block.replace(/<[^>]+>/g, "");
    assert.ok(
        !visibleText.includes(">"),
        `stray ">" text visible next to the buttons (markdown artifact?): ${JSON.stringify(visibleText)}`
    );
    for (const label of ["Rock", "Paper", "Scissors", "Reset"]) {
        assert.ok(visibleText.includes(label), `button label "${label}" missing from the buttons block`);
    }
});

test("style.css url() references point at existing local files", () => {
    const css = readFileSync(path.join(root, "style.css"), "utf8");
    const refs = [...css.matchAll(/url\(([^)]+)\)/g)].map((m) =>
        m[1].trim().replace(/^["']|["']$/g, "")
    );
    assert.ok(refs.length > 0, "expected style.css to reference at least one local file");
    for (const ref of refs) {
        if (/^(https?:)?\/\//.test(ref)) continue; // remote or root-absolute
        assert.ok(
            existsSync(path.join(root, ref)),
            `style.css references "${ref}" but the file does not exist`
        );
    }
});
