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

import React, { useEffect, useState } from "react";

import "./process-view-button.scss"

function ProcessViewButton({ camundaAPI, processInstanceId }) {
    const [activatedView, setActivatedView] = useState();

    const cockpitApi = camundaAPI.cockpitApi;
    const engine = camundaAPI.engine;
    const processViewEndpoint = `${cockpitApi}/plugin/camunda-process-views-plugin/${engine}/process-instance/${processInstanceId}`
    console.log('URL to server-side plugin: ', processViewEndpoint);

    const patternView = "view-with-patterns.xml";
    const quantumView = "view-before-rewriting.xml";

    // get the currently active view by retrieving the corresponding variable of the process instance
    useEffect(() => {
        fetch(
            processViewEndpoint + '/active-view',
            {
                headers: {
                    'Accept': 'application/json'
                }
            }
        ).then(async res => {

            // retrieve value from response
            let response = await res.json();
            setActivatedView(response['activeProcessView']);
            console.log('Currently activated view: ', response['activeProcessView'])
        }).catch(err => {
            console.error(err);
        });
    }, []);


    async function openView(viewName) {
        console.log('Switching to specified view: ', viewName);

        // switch to next view for the process instance
        console.log('Performing POST request at following URL to switch view: ', processViewEndpoint + '/view');
        const rawResponse = await fetch(processViewEndpoint + '/view/'+ viewName,
            {
                method: 'POST', body: '{}',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-XSRF-TOKEN": camundaAPI.CSRFToken,
                }
            });
        console.log('Switching to view resulted in: ', rawResponse);
        location.reload();
    }


    function triggerDeployment() {
        const deploymentButton = document.getElementById("deploymentButton");
        if (deploymentButton) {
            deploymentButton.click();
        } else {
            console.error("Button not found");
        }
    }

    return (
        <>
            <button id="pattern-view-button" className="btn btn-default btn-toolbar ng-scope process-view-button" title="Toggle Pattern View" onClick={() => openView(patternView)} tooltip-placement="left">
                <img class="process-view-button-picture" src="https://raw.githubusercontent.com/UST-QuAntiL/camunda-process-view-plugins/refs/heads/main/frontend/resources/pattern-icon.png" />
            </button>
            <button id="quantum-view-button" className="btn btn-default btn-toolbar ng-scope process-view-button" title="Toggle Quantum View" onClick={() => openView(quantumView)} tooltip-placement="left">
                <img class="process-view-button-picture" src="https://raw.githubusercontent.com/UST-QuAntiL/camunda-process-view-plugins/refs/heads/main/frontend/resources/QuantumViewIcon.svg" />
            </button>
            <button id="deployment-view-button" className="btn btn-default btn-toolbar ng-scope process-view-button" title="Toggle Deployment View" onClick={() => { triggerDeployment() }} tooltip-placement="left">
                <img class="process-view-button-picture" src="https://raw.githubusercontent.com/UST-QuAntiL/camunda-process-view-plugins/refs/heads/main/frontend/resources/DeploymentViewIcon.svg" />
            </button>
        </>
    );
}

export default ProcessViewButton;
