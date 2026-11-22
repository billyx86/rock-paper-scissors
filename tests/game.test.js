import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const html = readFileSync(path.join(here, "..", "index.html"), "utf8");

// Minimal in-memory DOM good enough to load and drive script.js.
class FakeElement {
    constructor(id) {
        this.id = id;
        this.textContent = "";
        this._listeners = {};
    }
    addEventListener(type, fn) {
        (this._listeners[type] ??= []).push(fn);
    }
    click() {
        for (const fn of this._listeners["click"] ?? []) fn();
    }
}

// Build the element map from the real index.html so the test always drives
// the ids the page actually exposes (and catches a missing/duplicate id).
function buildDom() {
    const byId = new Map();
    const seen = new Set();
    const idRe = /id="([^"]+)"/g;
    let m;
    while ((m = idRe.exec(html))) {
        const id = m[1];
        assert.ok(!seen.has(id), `duplicate id "${id}" in index.html`);
        seen.add(id);
        byId.set(id, new FakeElement(id));
    }
    for (const required of ["rock", "paper", "scissors", "reset", "score", "result-out"]) {
        assert.ok(byId.has(required), `index.html is missing id="${required}"`);
    }
    const documentStub = {
        getElementById: (id) => byId.get(id) ?? null,
        _listeners: {},
        addEventListener(type, fn) {
            (this._listeners[type] ??= []).push(fn);
        },
    };
    return { documentStub, byId };
}

// Load the real script.js against a fresh DOM. `random` controls what
// getComputerChoice() draws: 0 → rock, < 0.6667 → paper, else scissors.
function loadGame(random = 0) {
    const { documentStub, byId } = buildDom();
    const scriptSrc = readFileSync(path.join(here, "..", "script.js"), "utf8");
    // script.js uses only Math.random and Math.floor (Math's methods are
    // non-enumerable, so `{...Math}` would drop them) — pass exactly those two.
    const patchedMath = { floor: Math.floor, random: () => random };
    const fn = new Function("document", "Math", scriptSrc);
    fn(documentStub, patchedMath);
    return {
        byId,
        documentStub,
        score: () => byId.get("score").textContent,
        result: () => byId.get("result-out").textContent,
        click: (id) => byId.get(id)?.click(),
        // Simulate a physical keypress on the page.
        press: (key, modifiers = {}) => {
            const event = { key, ctrlKey: false, metaKey: false, altKey: false, ...modifiers };
            for (const fn of documentStub._listeners["keydown"] ?? []) fn(event);
        },
    };
}

test("page content is wrapped in a <main> landmark (a11y)", () => {
    const m = html.match(/<main\b[^>]*>[\s\S]*?<\/main>/i);
    assert.ok(m, "no <main> landmark — screen readers have no 'main content' region to jump to");
    // the game controls must live inside it
    assert.match(m[0], /id=["']rock["']/i, "the Rock button should be inside <main>");
    assert.match(m[0], /id=["']result-out["']/i, "the live result region should be inside <main>");
});

test("rock beats scissors: player scores", () => {
    const g = loadGame(0.99); // computer: scissors
    g.click("rock");
    assert.equal(g.score(), "You: 1, Computer: 0");
    assert.equal(g.result(), "You win! Rock beats scissors.");
});

test("paper beats rock: player scores", () => {
    const g = loadGame(0); // computer: rock
    g.click("paper");
    assert.equal(g.score(), "You: 1, Computer: 0");
    assert.equal(g.result(), "You win! Paper beats rock.");
});

test("scissors loses to rock: computer scores", () => {
    const g = loadGame(0); // computer: rock
    g.click("scissors");
    assert.equal(g.score(), "You: 0, Computer: 1");
    assert.equal(g.result(), "You lost! Rock beats scissors.");
});

test("same choice ties and neither scores", () => {
    const g = loadGame(0); // computer: rock
    g.click("rock");
    assert.equal(g.score(), "You: 0, Computer: 0");
    assert.equal(g.result(), "You tied! You both had rock.");
});

test("keyboard: R/P/S throw, Backspace resets (#6)", () => {
    const g = loadGame(0); // computer always draws rock
    g.press("r"); // tie
    assert.equal(g.score(), "You: 0, Computer: 0");
    g.press("P"); // case-insensitive: paper beats rock
    assert.equal(g.score(), "You: 1, Computer: 0");
    g.press("s"); // scissors loses to rock
    assert.equal(g.score(), "You: 1, Computer: 1");
    g.press("Backspace");
    assert.equal(g.score(), "");
    assert.equal(g.result(), "");
    g.press("p"); // playable again after keyboard reset
    assert.equal(g.score(), "You: 1, Computer: 0");
});

test("keyboard: unhandled and modifier-combo keys are ignored (#6)", () => {
    const g = loadGame(0);
    g.press("a");
    g.press("Enter");
    g.press("r", { ctrlKey: true }); // browser shortcut, not a throw
    g.press("r", { metaKey: true });
    g.press("r", { altKey: true });
    assert.equal(g.score(), "");
    assert.equal(g.result(), "");
});

test("keyboard: throws respect the game-over lock (#6)", () => {
    const g = loadGame(0); // computer always rock → paper wins every round
    for (let i = 0; i < 5; i++) g.press("p");
    assert.equal(g.score(), "You: 5, Computer: 0");
    g.press("p"); // game over: keys must be ignored
    assert.equal(g.score(), "You: 5, Computer: 0");
    assert.equal(g.result(), "You win! Congratulations.");
});

test("buttons have a visible focus style (keyboard playability)", () => {
    const css = readFileSync(path.join(here, "..", "style.css"), "utf8");
    assert.match(
        css,
        /:focus(?!-visible)\s*\{[^}]*outline[^;]*:?\s*\S/i,
        "no ':focus { outline: ... }' rule — keyboard users get no visible focus indicator"
    );
});

test("winning the match to 5 points is announced and locks further play", () => {
    const g = loadGame(0); // computer always draws rock → player's paper wins every round
    for (let i = 0; i < 5; i++) g.click("paper");
    assert.equal(g.score(), "You: 5, Computer: 0");
    assert.equal(g.result(), "You win! Congratulations.");
    g.click("paper"); // game over: clicks must be ignored
    assert.equal(g.score(), "You: 5, Computer: 0");
    assert.equal(g.result(), "You win! Congratulations.");
});

test("reset clears the score and result", () => {
    const g = loadGame(0); // computer: rock
    g.click("paper"); // player up 1-0
    assert.equal(g.score(), "You: 1, Computer: 0");
    g.click("reset");
    assert.equal(g.score(), "");
    assert.equal(g.result(), "");
    // play works again after a reset
    g.click("paper");
    assert.equal(g.score(), "You: 1, Computer: 0");
});
