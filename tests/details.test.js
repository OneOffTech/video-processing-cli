const Command = require("../src/commands/details.js");
const Helper = require("../src/helpers/details.js");

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

test("helper throws if non-existing file is used", async () => {
  var file = "./videos/video-360-1111.mp4";

  expect.assertions(1);
  try {
    await Helper.get(file);
  } catch (e) {
    expect(e.message).toMatch(/exists/);
  }
});

test("helper return file metadata in json format", async () => {
  var file = "./videos/video-360.mp4";

  let details = await Helper.get(file);
  expect(details).toHaveProperty("streams");
  expect(details).toHaveProperty("format");
  expect(details).toHaveProperty(
    "format.format_name",
    "mov,mp4,m4a,3gp,3g2,mj2"
  );
});

test("command not kill the process for non-existing file", async () => {
  var file = "./videos/video-360--1111.mp4";

  expect(() => {
    Command(file, {});
  }).not.toThrow();
});

test("command run", async () => {
  var file = "./videos/video-360.mp4";

  expect(() => {
    Command(file, {});
  }).not.toThrow();
});
