module.exports = function (RED) {
  var dashboard = require("../dashboard")(RED);

  function DropdownNode(config) {
    RED.nodes.createNode(this, config);
    this.multiple = config.multiple || false;
    this.state = [" ", " "];
    var node = this;
    node.status({});

    var group = RED.nodes.getNode(config.group);
    if (!group) {
      return;
    }
    var tab = RED.nodes.getNode(group.config.tab);
    if (!tab) {
      return;
    }

    var control = {
      type: "dropdown",
      multiple: config.multiple,
      label: config.label,
      tooltip: config.tooltip,
      place: config.place,
      order: config.order,
      value: config.payload || node.id,
      width: config.width || group.config.width || 3,
      width: config.width || 3,
      height: config.height || 1,
      className: config.className || "",
    };

    for (var o = 0; o < config.options.length; o++) {
      config.options[o].label = config.options[o].label || config.options[o].value;
    }
    control.options = config.options;

    node.on("input", function (msg) {
      node.topi = msg.topic;
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
  RED.nodes.registerType("soop_dropdown", DropdownNode);
};
