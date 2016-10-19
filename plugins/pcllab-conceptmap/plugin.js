/**
 * @name Concept Map
 *
 * @author Matt Molo
 */

jsPsych.plugins["pcllab-conceptmap"] = (function () {
    var plugin = {};

    plugin.trial = function (display_element, trial) {

        trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);
        display_element.load("plugins/pcllab-conceptmap/template.html", function() {

            $('.finish').click(function() {
                var connections = conceptMap.connections.map(function(conn) {
                    return {
                        start_node: conn.startNode.text,
                        end_node: conn.endNode.text
                    }
                })

                var nodes = conceptMap.nodes.map(function(node) {
                    return {
                        text: node.text
                    }
                })

                var trial_data = {
                    nodes: nodes,
                    connections: connections
                };
                display_element.html('');
                jsPsych.finishTrial(trial_data);
            });
        });
    };

    return plugin;
})();
