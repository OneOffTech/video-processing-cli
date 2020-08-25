const Command = require("../src/commands/pack.js");
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

test("command packs 2 videos", () => {
  var files = ["./videos/video-360.mp4", "./videos/video-540.mp4"];

  expect(async () => await Command(
    {
      arguments: { files: files },
      options: { name: "test" }
    },
    NullOutput
  )).not.toBeUndefined();
});

test("command throws if no video files are specified", async () => {
  expect.assertions(1);
  try {
    await Command(
      {
        arguments: { files: [] },
        options: {}
      },
      NullOutput
    );
  } catch (e) {
    expect(e.message).toMatch(/specify/);
  }
});
