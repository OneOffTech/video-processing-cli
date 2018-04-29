const Process = require("../src/commands/process.js");
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

test("process generates dash manifest from video", () => {
  var file = "./videos/video-360.mp4";
  var path = "./videos";

  expect(() => {
    Process(
      {
        arguments: { file: file, path: path },
        options: {}
      },
      NullOutput
    );
  }).not.toThrow();
});

test("process generates dash manifest from video without audio", () => {
  var file = "./videos/video-without-audio.mp4";
  var path = "./videos";

  expect(() => {
    Process(
      {
        arguments: { file: file, path: path },
        options: {}
      },
      NullOutput
    );
  }).not.toThrow();
});
