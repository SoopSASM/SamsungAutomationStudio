module.exports = function (RED) {
  var dashboard = require("../dashboard")(RED);
  const { SOOP_NODE_TYPE } = require("../common/common");

  function DropdownNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on("input", function (msg) {
      let value = msg.payload;
      if (!isNaN(parseInt(value))) {
        value = parseInt(value);
      } else {
        value = 0;
      }
      dashboard.emitState({
        nodeId: node.id,
        value: value,
      });
    });

    dashboard.addNode({
      node: node,
      onMessage: message => {
        node.send({
          payload: message.value,
        });
      },
    });
  }
  RED.nodes.registerType(SOOP_NODE_TYPE.DROPDOWN, DropdownNode);
};
