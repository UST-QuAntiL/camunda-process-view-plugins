/*
 * Copyright (c) 2022 Institute of Architecture of Application Systems -
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
];

export default plugins;
