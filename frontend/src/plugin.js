/*
 * Copyright (c) 2023 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import ReactDOM from "react-dom";

import ProcessViewButton from "./process-instance-runtime-action/ProcessViewButton";
import DeploymentViewButton from "./process-instance-runtime-action/DeploymentViewButton.js";
import {renderTable} from "./process-instance-runtime-tab/ViewVariablesTable";
import {renderOverlay} from "./process-instance-diagram-overlay/ViewOverlay";
import {renderDeploymentInformationTable} from "./deployment-information-table.js";
import {addSubprocessToggleButton} from "./deployment-subprocess-visualization.js";

const plugins = [
  {
    id: "process-instance-view-selection",
    pluginPoint: "cockpit.processInstance.runtime.action",
    render: (node, {api, processInstanceId}) => {
      console.log('Loading plugin to add view selection button!');
      console.log('Available APIs to retrieve data: ', api);
      console.log('Plugin loaded for process instance ID: ', processInstanceId);
      ReactDOM.render(
          <ProcessViewButton camundaAPI={api} processInstanceId={processInstanceId}/>,
          node
      );
    },
    priority: 12,
  },
 {
    id: "process-instance-runtime-tab",
    pluginPoint: "cockpit.processInstance.runtime.tab",
    render: (node, { processInstanceId, api }) => {
      renderTable(api, processInstanceId, node);
    },
    properties: {
      label: "Quantum Data View"
    },
    priority: 12,
  },
  {
    id: "process-instance-diagram-overlay",
    pluginPoint: "cockpit.processInstance.diagram.plugin",
    render: (viewer, { processInstanceId, api }) => {
      renderOverlay(viewer, api, processInstanceId);
    },
    priority: 12,
  },
  {
    id: "process-instance-deployment-runtime-tab",
    pluginPoint: "cockpit.processInstance.runtime.tab",
    render: renderDeploymentInformationTable,
    properties: {
        label: "Deployment Data View"
    },
    priority: 12,
},
{
    id: "process-instance-deployment-diagram-overlay",
    pluginPoint: "cockpit.processInstance.diagram.plugin",
    render: addSubprocessToggleButton,
    priority: 12,
}
];

export default plugins;
