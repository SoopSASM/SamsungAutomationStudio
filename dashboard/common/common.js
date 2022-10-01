const FRONT_SOCKET_TYPE = {
  INIT_DASHBOARD_STATE: "init-dashboard-state",
  UPDATE_NODE_STATE: "update-node-state",
  RECEIVE_MESSAGE: "receive-message",
};

const EDITOR_SOCKET_TYPE = {
  FLOW_DEPLOYED: "flow-deployed",
};

const URL = {
  DASHBOARD: "/dashboard",
  GROUP_INFO: "/group",
};

const SOOP_NODE_TYPE = {
  CONFIG: "soop_dashboard_config",
  BUTTON: "soop_button",
  CHART: "soop_chart",
  DROPDOWN: "soop_dropdown",
  GAUGE: "soop_gauge",
  IMAGE: "soop_image",
  LIST: "soop_list",
  SLIDER: "soop_slider",
  SWITCH: "soop_switch",
  TEXT: "soop_text",
};

exports.FRONT_SOCKET_TYPE = FRONT_SOCKET_TYPE;
exports.EDITOR_SOCKET_TYPE = EDITOR_SOCKET_TYPE;
exports.URL = URL;
exports.SOOP_NODE_TYPE = SOOP_NODE_TYPE;
