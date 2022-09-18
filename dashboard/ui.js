let initialized = false;

module.exports = function (RED) {
  if (!initialized) {
    initialized = true;
    init(RED);
  }

  return {
    testFunc,
  };
};

function init(RED) {
  console.log("ui initialize");
}

function testFunc() {
  return "test message";
}
