let initialized = false;

module.exports = function (RED) {
  if (!initialized) {
    initialized = true;
    init(RED.httpNode || RED.httpAdmin);
  }

  return {
    testFunc,
  };
};

const path = require("path");
const serveStatic = require("serve-static");

function init(app) {
  app.use("/ui", serveStatic(path.join(__dirname, "/dist")));
  console.log("react dashboard started at /ui");
}

function testFunc() {
  return "test message";
}
