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

import React, {useEffect, useState} from "react";

import "./process-view-button.scss"
import OpenTOSCARenderer from "../process-instance-diagram-overlay/opentosca/OpenTOSCARenderer";

function DeploymentViewButton({camundaAPI, processInstanceId, viewer}) {
    console.log(viewer)
    const canvas = viewer.get("canvas")
    new OpenTOSCARenderer(viewer.get("eventBus"), viewer.get("styles"), viewer.get("bpmnRenderer"), viewer.get("textRenderer"), canvas)
    const [activatedView, setActivatedView] = useState();
    const [showSubProcesses, setSubProcesses] = useState(false);
    const [buttonClicked, setButtonClicked] = useState(
        // Set the initial state from localStorage or default to false
        localStorage.getItem("buttonClicked") === "false"
      );

    const cockpitApi = camundaAPI.cockpitApi;
    const engine = camundaAPI.engine;
    const processViewEndpoint = `${cockpitApi}/plugin/camunda-process-views-plugin/${engine}/process-instance/${processInstanceId}`
    console.log('URL to server-side plugin: ', processViewEndpoint);

    // get the currently active view by retrieving the corresponding variable of the process instance
    useEffect(() => {
        localStorage.setItem("buttonClicked", buttonClicked);
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
    }, [buttonClicked]);

    async function openDialog(activatedView){

    const elementRegistry = viewer.get("elementRegistry")
    const drilldownOverlayBehavior = viewer.get("drilldownOverlayBehavior")
    const subProcesses = elementRegistry
        .filter(element => element.type === "bpmn:SubProcess" && element.collapsed)
    const update = () => {
        for (const subProcess of subProcesses) {
            if (subProcess.parent !== canvas.getRootElement()) continue;
            const newType = showSubProcesses ? "bpmn:SubProcess" : "bpmn:ServiceTask"
            if (subProcess.type !== newType) {
                canvas.removeShape(subProcess)
                subProcess.type = newType
                canvas.addShape(subProcess)
                if (showSubProcesses) {
                    drilldownOverlayBehavior.addOverlay(subProcess)
                }
            }
        }
    }
            console.log('Switching from currently activated view: ', activatedView);
            setButtonClicked((prev) => !prev);

            // switch to next view for the process instance
            console.log('Performing POST request at following URL to switch view: ', processViewEndpoint + '/change-view');
            const rawResponse = await fetch(processViewEndpoint + '/change-view',
                {method: 'POST', body: '{}',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-XSRF-TOKEN": camundaAPI.CSRFToken,
                }});
            console.log('Switching to next view resulted in: ', rawResponse);
            update();
            //location.reload();
    }

    actionButtonElement.addEventListener("click", () => {
        showSubProcesses = !showSubProcesses;
        update()
    })

    return (
        <>
            <button className={`btn btn-default btn-toolbar ng-scope process-view-button ${buttonClicked ? "clicked" : ""}`} title="Toggle Quantum View" onClick={() => openDialog(viewer)} tooltip-placement="left">
                <img class="process-view-button-picture" src="https://raw.githubusercontent.com/PlanQK/workflow-modeler/master/components/bpmn-q/modeler-component/extensions/quantme/resources/QuantME_Logo.svg" />
            </button>
        </>
    );
}

export default DeploymentViewButton;
