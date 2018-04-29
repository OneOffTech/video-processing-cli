const Command = require("../src/commands/encode.js");
const NullOutput = require("../src/output/nullOutput.js");
const path = require("path");

var cwd = process.cwd().match(/tests/)
  ? path.dirname(process.cwd())
  : process.cwd();

beforeEach(() => {
  // change the current directory to the original root location
  // as some tests change it to simulate different execution
  // scenarios
  return new Promise(function(resolve, reject) {
    process.chdir(cwd);
    resolve();
  });
});

test("command transcode video using explicit preset", () => {
  var file = "./videos/video-540.mp4";
  var path = "./videos";

  expect(() => {
    Command(
      {
        arguments: { file: file, path: path },
        options: { preset: "V360" }
      },
      NullOutput
    );
  }).not.toThrow();
});

test("command transcode video using auto preset", () => {
  var file = "./videos/video-360.mp4";
  var path = "./videos";

  expect(() => {
    Command(
      {
        arguments: { file: file, path: path },
        options: {}
      },
      NullOutput
    );
  }).not.toThrow();
});

test("command throws if invalid preset is used", async () => {
  var file = "./videos/video-360.mp4";
  var path = "./videos";

  expect.assertions(1);
  try {
    await Command(
      {
        arguments: { file: file, path: path },
        options: { preset: "11111" }
      },
      NullOutput
    );
  } catch (e) {
    expect(e.message).toMatch(/preset/);
  }
});
