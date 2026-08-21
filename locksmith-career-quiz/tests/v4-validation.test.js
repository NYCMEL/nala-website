const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const configSource = fs.readFileSync(path.join(root, "js/betterme.config.js"), "utf8");
const appSource = fs.readFileSync(path.join(root, "js/betterme.js"), "utf8");
const htmlSource = fs.readFileSync(path.join(root, "index.html"), "utf8");
const cssSource = fs.readFileSync(path.join(root, "scss/styles.css"), "utf8");
const context = { window: {} };

vm.runInNewContext(configSource, context);
const config = context.window.NALA_V4_CONFIG;

assert.ok(config, "V4 config should load");
assert.equal(config.version, "4.0.0");
assert.equal(config.screens.length, 20, "all 20 approved screens should be present");
assert.deepEqual(Array.from(config.screens, (screen) => screen.id), Array.from({ length: 20 }, (_, index) => String(index + 1).padStart(2, "0")));

const finalScreen = config.screens[19];
assert.equal(finalScreen.type, "final");
assert.equal(finalScreen.action, "Yes, I'm Ready.");
assert.equal(config.screens[17].revealTitle, "Your Personal Roadmap");
assert.match(config.screens[17].disclaimer, /not a guarantee of results/i);
assert.match(config.screens[14].future, /2028/);

for (const index of [8, 9, 10, 11]) {
  const screen = config.screens[index];
  assert.equal(screen.type, "discovery");
  assert.equal(screen.options.length, 3);
  const copy = JSON.stringify(screen);
  assert.doesNotMatch(copy, /correct|incorrect/i, `screen ${screen.id} must not score guesses`);
}

for (const screen of config.screens) {
  if (screen.options) {
    assert.ok(screen.key, `screen ${screen.id} with answers needs a persistence key`);
    assert.ok(screen.selectionEvent, `screen ${screen.id} with answers needs a selection event`);
    assert.ok(screen.options.every((option) => option.value && option.label), `screen ${screen.id} options need values and labels`);
  }
}

const allApprovedCopy = JSON.stringify(config);
assert.doesNotMatch(allApprovedCopy, /2027/);
assert.doesNotMatch(allApprovedCopy, /calculator|forecast|projection/i);
assert.doesNotMatch(allApprovedCopy, /fake urgency|countdown|limited time/i);

for (const eventName of ["screen_viewed", "screen_completed", "selection_made", "cta_impression", "cta_click", "checkout_start_requested"]) {
  assert.ok(appSource.includes(`"${eventName}"`), `analytics event ${eventName} should be emitted`);
}

assert.match(appSource, /localStorage\.setItem\(this\.config\.storageKey/);
assert.match(appSource, /age_verified: age >= 18/);
assert.doesNotMatch(appSource, /birth_date|full_dob|date_of_birth/);
assert.match(appSource, /prefers-reduced-motion/);
assert.match(htmlSource, /aria-live="polite"/);
assert.match(htmlSource, /role="progressbar"/);
assert.match(cssSource, /@media \(max-width: 390px\)/);
assert.match(cssSource, /@media \(prefers-reduced-motion: reduce\)/);

for (const asset of ["assets/nala-logo.png", "assets/nala-logo-black.png"]) {
  assert.ok(fs.existsSync(path.join(root, asset)), `${asset} should exist`);
}

console.log("V4 validation passed: 20 screens, privacy, copy locks, analytics, accessibility, and responsive rules verified.");
