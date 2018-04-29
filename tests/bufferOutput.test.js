const BufferOutput = require("../src/output/bufferOutput.js");

test("info output to stdout buffer", () => {
  BufferOutput.info("message");
  expect(BufferOutput.getOutput()).toMatch(/message/);

  BufferOutput.info("second", "something");
  expect(BufferOutput.getOutput()).toMatch(/second something/);
});

test("comment output to stdout buffer", () => {
  BufferOutput.comment("message");
  expect(BufferOutput.getOutput()).toMatch(/message/);

  BufferOutput.comment("second", "something");
  expect(BufferOutput.getOutput()).toMatch(/second something/);
});

test("text output to stdout buffer", () => {
  BufferOutput.text("message");
  expect(BufferOutput.getOutput()).toMatch(/message/);

  BufferOutput.text("second", "something");
  expect(BufferOutput.getOutput()).toMatch(/second something/);
});

test("success output to stdout buffer", () => {
  BufferOutput.success("message");
  expect(BufferOutput.getOutput()).toMatch(/message/);

  BufferOutput.success("second", "something");
  expect(BufferOutput.getOutput()).toMatch(/second something/);
});

test("warning output to stderr buffer", () => {
  BufferOutput.warning("message");
  expect(BufferOutput.getErrorOutput()).toMatch(/message/);

  BufferOutput.warning("second", "something");
  expect(BufferOutput.getErrorOutput()).toMatch(/second something/);
});

test("error output to stderr buffer", () => {
  BufferOutput.error("message");
  expect(BufferOutput.getErrorOutput()).toMatch(/message/);

  BufferOutput.error("second", "something");
  expect(BufferOutput.getErrorOutput()).toMatch(/second something/);
});
