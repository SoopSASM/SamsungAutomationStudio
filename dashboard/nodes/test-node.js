module.exports = function (RED) {
  const ui = require("../ui")(RED);

  function TestNode(config) {
    const node = this;
    RED.nodes.createNode(node, config);
    console.log("Test Node created" + ui.testFunc());
  }

  RED.nodes.registerType("test-node", TestNode);
};
