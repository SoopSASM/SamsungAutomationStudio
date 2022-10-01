module.exports = function (RED) {
  const dashboard = require("../dashboard")(RED);

  function SoopTextNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    const group = RED.nodes.getNode(config.group);
    if (!group) {
      return;
    }
    const tab = RED.nodes.getNode(group.config.tab);
    if (!tab) {
      return;
    }

    let state = {
      node_id: config.id,
      nodeType: config.type,
      group: config.group,
      size: [config.width, config.height],
      name: config.name,
      time: "",
      label: config.label,
      format: config.format,
      layout: config.layout,
      fontSize: config.fontSize,
      value: "",
    };

    node.on("input", function (msg) {
      let form = config.format.replace(/{{/g, "").replace(/}}/g, "").replace(/\s/g, "") || "_zzz_zzz_zzz_";
      if (form.split(".")[0] != "msg") return;

      form = form.split(".")[1];
      let value = RED.util.getMessageProperty(msg, form);
      if (value !== undefined) state.value = value;

      dashboard.emitState(state);
    });

    dashboard.addNode({
      node: node,
    });
  }
  RED.nodes.registerType("soop_text", SoopTextNode);
};
