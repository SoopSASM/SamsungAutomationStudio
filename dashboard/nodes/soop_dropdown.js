module.exports = function (RED) {
  var dashboard = require("../dashboard")(RED);

  function DropdownNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    var valueMap = new Map();
    var labelMap = new Map();
    for (var i = 0; i < config.options.length; i++) {
      let option = config.options[i];
      valueMap.set(option.value, i);
      labelMap.set(i, option.label);
    }

    node.on("input", function (msg) {
      let value = valueMap.get(msg.payload);
      if (!value) value = 0;
      dashboard.emitState({
        nodeId: node.id,
        value: value,
      });
    });

    dashboard.addNode({
      node: node,
      onMessage: message => {
        let label = labelMap.get(message.value);
        if (!label) label = labelMap.get(0);
        node.send({
          payload: label,
        });
      },
    });
  }
  RED.nodes.registerType("soop_dropdown", DropdownNode);
};
