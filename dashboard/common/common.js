const FRONT_SOCKET_TYPE = {
  INIT_NODE: "init-node",
  UPDATE_NODE: "udpate-node",
  RECEIVE_MESSAGE: "receive-message",
};

const EDITOR_SOCKET_TYPE = {
  FLOW_DEPLOYED: "flow-deployed",
};

const DASHBOARD_PATH = "/dashboard";

const SOOP_NODE_TYPE = {
  CONFIG: "soop_dashboard_config",
  SWITCH: "soop_switch",
  SLIDER: "soop_slider",
  BUTTON: "soop_button",
  CHART: "soop_chart",
  GAUGE: "soop_gauge",
  LIST: "soop_list",
  DROPDOWN: "soop_dropdown",
  TEXT: "soop_text",
};

exports.FRONT_SOCKET_TYPE = FRONT_SOCKET_TYPE;
exports.EDITOR_SOCKET_TYPE = EDITOR_SOCKET_TYPE;
exports.DASHBOARD_PATH = DASHBOARD_PATH;
exports.SOOP_NODE_TYPE = SOOP_NODE_TYPE;
