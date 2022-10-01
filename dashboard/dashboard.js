let initialized = false;

module.exports = function (RED) {
  if (!initialized) {
    initialized = true;
    init(RED);
  }

  return {
    emitState,
    addNode,
    addGroup,
  };
};

const path = require("path");
const socketio = require("socket.io");
const serveStatic = require("serve-static");
const { FRONT_SOCKET_TYPE, EDITOR_SOCKET_TYPE, URL } = require("./common/common");
const { group } = require("console");

let io = null;
let globalNodes = {};
let globalState = { tabs: [] };
let globalGroups = {};

function init(RED) {
  const app = RED.httpNode || RED.httpAdmin;
  const server = RED.server;

  io = socketio(server);
  initSocket(io);

  app.use(URL.DASHBOARD, serveStatic(path.join(__dirname, "/dist")));

  app.get(URL.GROUP_INFO, (req, res) => {
    const query = req.query;
    const group = globalGroups[query.id];
    if (!group) res.status(204).send({ message: `Invalid Group Id : ${query.id}` });
    const config = group.config;
    if (!config) res.status(204).send({ message: `Group Info Not Found : ${query.id}` });

    res.send({
      width: config.width,
      height: config.height,
      state: config.groupState,
    });
  });
}

function initSocket(io) {
  io.on("connection", socket => {
    socket.emit(FRONT_SOCKET_TYPE.INIT_DASHBOARD_STATE, getState());

    socket.on(FRONT_SOCKET_TYPE.RECEIVE_MESSAGE, message => {
      const node = globalNodes[message.nodeId].runtime;
      if (!node) return;
      if (typeof node.onMessage === "function") {
        node.onMessage(message);
      }
    });

    socket.on(EDITOR_SOCKET_TYPE.FLOW_DEPLOYED, state => {
      setState(state);
      io.emit(FRONT_SOCKET_TYPE.INIT_DASHBOARD_STATE, getState());
    });

    socket.on(EDITOR_SOCKET_TYPE.ADD_NODE_TO_GROUP, ({ groupId, x, y, w, h }) => {
      const group = globalGroups[groupId];
      if (!group) return;
      const config = group.config;
      if (!config) return;
      const groupState = config.groupState;
      if (!groupState || !Array.isArray(groupState)) return;

      for (let i = x; i < x + w; ++i) {
        for (let j = y; j < y + h; ++j) {
          groupState[i][j] = true;
        }
      }
    });

    socket.on(EDITOR_SOCKET_TYPE.REMOVE_NODE_FROM_GROUP, ({ groupId, x, y, w, h }) => {
      const group = globalGroups[groupId];
      if (!group) return;
      const config = group.config;
      if (!config) return;
      const groupState = config.groupState;
      if (!groupState || !Array.isArray(groupState)) return;

      for (let i = x; i < x + w; ++i) {
        for (let j = y; j < y + h; ++j) {
          groupState[i][j] = false;
        }
      }
    });
  });
}

function emitState(state, isTimeSeries = false) {
  const nodeId = state.node_id;

  if (globalNodes && !globalNodes.hasOwnProperty(nodeId)) return;

  if (isTimeSeries) {
    state.time = Date.now();
  } else {
    globalNodes[nodeId].states = [];
  }

  const sendState = { ...state };
  delete sendState.node_id;

  globalNodes[nodeId].states.push(sendState);

  emit(nodeId, sendState, isTimeSeries);
}

function emit(nodeId, state, isTimeSeries) {
  io.emit(FRONT_SOCKET_TYPE.UPDATE_NODE_STATE, { nodeId, isTimeSeries, state });
}

function addNode(nodeObject) {
  if (typeof nodeObject != "object") return;
  const node = nodeObject.node;
  if (!node) return;

  globalNodes[node.id] = {
    ...nodeObject,
    states: [],
  };
}

function addGroup(group) {
  if (typeof group != "object") return;
  globalGroups[group.id] = group;
}

function setState(state) {
  globalState = { ...state };
  syncGlobalNode();
}

function getState() {
  const tabs = [];
  for (const tab of globalState.tabs) {
    const tabObject = { ...tab };

    const groups = [];
    for (const group of tab.groups) {
      const groupObject = { ...group };

      const nodes = [];
      for (const node of group.nodes) {
        nodes.push({
          ...node,
          states: globalNodes[node.id].states,
        });
      }

      groupObject.nodes = nodes;
      groups.push(groupObject);
    }

    tabObject.groups = groups;
    tabs.push(tabObject);
  }

  return { tabs: tabs };
}

function syncGlobalNode() {
  const exists = {};

  for (const tab of globalState.tabs) {
    for (const group of tab.groups) {
      for (const node of group.nodes) {
        exists[node.id] = true;
      }
    }
  }

  for (const id in globalNodes) {
    if (!exists[id]) delete globalNodes[id];
  }
}
