const Presets = require("../src/helpers/presets.js");

test("presets define both transcode and dash presets", () => {
  expect(Presets.SCALE_PRESETS).toBeDefined();
  expect(Presets.DASH_DEFAULT).toBeDefined();
});

test("scale preset exists return false for non-existent preset", () => {
  expect(Presets.SCALE_PRESETS.exists("VB109")).toBeFalsy();
});

test("scale preset exists return true for existent preset", () => {
  expect(Presets.SCALE_PRESETS.exists("V1080")).toBeTruthy();
});

test("auto scale select V360 for video.height <= 360", () => {
  expect(Presets.SCALE_PRESETS.auto("360")).toBe(Presets.SCALE_PRESETS.V360);
  expect(Presets.SCALE_PRESETS.auto("240")).toBe(Presets.SCALE_PRESETS.V360);
  expect(Presets.SCALE_PRESETS.auto("361")).toBe(Presets.SCALE_PRESETS.V360);
});

test("auto scale select V480 for video.height >= 540", () => {
  expect(Presets.SCALE_PRESETS.auto("540")).toBe(Presets.SCALE_PRESETS.V480);
  expect(Presets.SCALE_PRESETS.auto("640")).toBe(Presets.SCALE_PRESETS.V480);
});

test("auto scale select V540 for video.height >= 720", () => {
  expect(Presets.SCALE_PRESETS.auto("720")).toBe(Presets.SCALE_PRESETS.V540);
  expect(Presets.SCALE_PRESETS.auto("800")).toBe(Presets.SCALE_PRESETS.V540);
  expect(Presets.SCALE_PRESETS.auto("1080")).toBe(Presets.SCALE_PRESETS.V540);
});
