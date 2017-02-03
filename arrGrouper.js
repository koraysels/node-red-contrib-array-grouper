/**
 * Copyright 2014 Leon van Kammen / Coder of salvation. All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without modification, are
 * permitted provided that the following conditions are met:
 *
 *    1. Redistributions of source code must retain the above copyright notice, this list of
 *       conditions and the following disclaimer.
 *
 *    2. Redistributions in binary form must reproduce the above copyright notice, this list
 *       of conditions and the following disclaimer in the documentation and/or other materials
 *       provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY Leon van Kammen AS IS'' AND ANY EXPRESS OR IMPLIED
 * WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 * FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL Leon van Kammen OR
 * CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
 * ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
 * ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * The views and conclusions contained in the software and documentation are those of the
 * authors and should not be interpreted as representing official policies, either expressed
 * or implied, of Leon van Kammen
 */

module.exports = function (RED) {
    "use strict";
    const _ = require('lodash');

    function ArrGrouperNode(config) {
        RED.nodes.createNode(this, config);
        this.property = config.property;
        var propertyParts = config.property.split("."),
            node = this;

        var groupSize = config.groups;

        this.on('input', function (msg) {
            if (typeof propertyParts == "object" && propertyParts != undefined) {
                var prop = propertyParts.reduce(function (obj, i) {
                    return obj[i]
                }, msg);
                msg.payload_unsplit = msg.payload;

                if (prop != undefined && prop.length) {

                    var resultMessageArray = _.map(_.chunk(prop, groupSize), function (group) {
                        if (group) {
                            var newGroup = RED.util.cloneMessage(msg);
                            newGroup.payload = group;

                            return newGroup;
                        }
                    });
                    
                    node.send(resultMessageArray);
                }
            } else {
                console.error("node splitter did not receive an array");
            }
        });
    }

    RED.nodes.registerType("ArrGrouper", ArrGrouperNode);
}

// [{payload: [0, 1, 2]}, {payload: [0, 1, 2]}, {payload: [0, 1, 2]}]
