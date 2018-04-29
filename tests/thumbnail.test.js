const Command = require("../src/commands/thumbnail.js");
const NullOutput = require("../src/output/nullOutput.js");

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

test("command generates thumbnail from video in png format", () => {
  var file = "./videos/video-360.mp4";
  var path = "./videos";

  expect(() => {
    Command(
      {
        arguments: { file: file, path: path },
        options: { format: "png" }
      },
      NullOutput
    );
  }).not.toThrow();
});

test("command generates thumbnail from video in jpg format", () => {
  var file = "./videos/video-360.mp4";
  var path = "./videos";

  expect(() => {
    Command(
      {
        arguments: { file: file, path: path },
        options: { format: "jpg" }
      },
      NullOutput
    );
  }).not.toThrow();
});

test("command throws if output filename lacks jpg extension", () => {
  var file = "./videos/video-360.mp4";
  var path = "./videos";

  expect(() => {
    Command(
      {
        arguments: { file: file, path: path },
        options: { format: "jpg", out: "something" }
      },
      NullOutput
    );
  }).toThrowError(/extension/);
});

test("command throws if output filename lacks png extension", () => {
  var file = "./videos/video-360.mp4";
  var path = "./videos";

  expect(() => {
    Command(
      {
        arguments: { file: file, path: path },
        options: { format: "png", out: "something" }
      },
      NullOutput
    );
  }).toThrowError(/extension/);
});

test("command throws if format is unsupported", () => {
  var file = "./videos/video-360.mp4";
  var path = "./videos";

  expect(() => {
    Command(
      {
        arguments: { file: file, path: path },
        options: { format: "gif" }
      },
      NullOutput
    );
  }).toThrowError(/format/);
});
