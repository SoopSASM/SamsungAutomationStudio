module.exports = function(RED) {
    var ui = require('../ui')(RED);

    function validateSwitchValue(node, property, type, payload) {
        if (payloadType === 'flow' || payloadType === 'global') {
            try {
                var parts = RED.util.normalisePropertyExpression(payload);
                if (parts.length === '') {
                    throw new Error();
                }
            } catch (err) {
                node.warn("Invalid payload property expression - defaulting to node id")
                payload = node.id;
                payloadType = 'str';
            }
        } else {
            payload = payload || node.id;
        }
    }

    function TestSwitchNode(config) {
        RED.nodes.createNode(this, config);
        this.state = ["off", " "];
        var node = this;
        node.status({});

        var group = RED.nodes.getNode(config.group);
        if (!group) { return; }
        var tab = RED.nodes.getNode(group.config.tab);
        if (!tab) { return; }

        var parts;
        var onvalue = config.onvalue;
        var onvalueType = config.onvalueType;
        if (onvalueType === 'flow' || onvalueType === 'global') {
            try {
                parts = RED.util.normalisePropertyExpression(onvalue);
                if (parts.length === 0) {
                    throw new Error();
                }
            } catch (err) {
                node.warn("Invalid onvalue property expression - defaulting to true")
                onvalue = true;
                onvalueType = 'bool';
            }
        }
        var offvalue = config.offvalue;
        var offvalueType = config.offvalueType;
        if (offvalueType === 'flow' || offvalueType === 'global') {
            try {
                parts = RED.util.normalisePropertyExpression(offvalue);
                if (parts.length === 0) {
                    throw new Error();
                }
            } catch (err) {
                node.warn("Invalid offvalue property expression - defaulting to false")
                offvalue = false;
                offvalueType = 'bool';
            }
        }

        node.on("input", function(msg) {
            node.topi = msg.topic;
        });

        var done = ui.add({
            node: node,
            tab: tab,
            group: group,
            emitOnlyNewValues: false,
            state: false,
            control: {
                type: 'switch' + (config.style ? '-' + config.style : ''),
                label: config.label,
                tooltip: config.tooltip,
                order: config.order,
                value: false,
                onicon: config.onicon,
                officon: config.officon,
                animate: config.animate ? "flip-icon" : "",
                width: config.width || group.config.width || 6,
                height: config.height || 1,
                min: Math.min(config.min, config.max),
                max: Math.max(config.max, config.min),
                step: Math.abs(config.step) || 1,
            },
            convert: function(payload, oldval, msg) {
                var myOnValue, myOffValue;

                if (onvalueType === "date") { myOnValue = Date.now(); } else { myOnValue = RED.util.evaluateNodeProperty(onvalue, onvalueType, node); }

                if (offvalueType === "date") { myOffValue = Date.now(); } else { myOffValue = RED.util.evaluateNodeProperty(offvalue, offvalueType, node); }

                if (this.storeFrontEndInputAsState) {
                    if (myOnValue === oldval) { return true; }
                    if (oldval === true) { return true; } else { return false; }
                }

                if (RED.util.compareObjects(myOnValue, msg.payload)) { node.state[0] = "on"; return true; } else if (RED.util.compareObjects(myOffValue, msg.payload)) { node.state[0] = "off"; return false; } else { return oldval; }
            },
            convertBack: function(value) {
                node.state[1] = value ? "on" : "off";
                if (node.pt) {
                    node.status({ shape: (value ? "dot" : "ring"), text: value ? "on" : "off" });
                }
                var payload = value ? onvalue : offvalue;
                var payloadType = value ? onvalueType : offvalueType;

                if (payloadType === "date") { value = Date.now(); } else {
                    try {
                        value = RED.util.evaluateNodeProperty(payload, payloadType, node);
                    } catch (e) {
                        if (payloadType === "bin") { node.error("Badly formatted buffer"); } else { node.error(e, payload); }
                    }
                }
                return value;
            },
            beforeSend: function(msg) {
                var t = RED.util.evaluateNodeProperty(config.topic, config.topicType || "str", node, msg) || node.topi;
                if (t) { msg.topic = t; }
            }
        });

        if (!node.pt) {
            node.on("input", function() {
                var shp = (node.state[0] == "on") ? "dot" : "ring";
                node.status({ shape: shp });
            });
        }

        node.on("close", done);
    }
    RED.nodes.registerType("ui_test_switch", TestSwitchNode);
};