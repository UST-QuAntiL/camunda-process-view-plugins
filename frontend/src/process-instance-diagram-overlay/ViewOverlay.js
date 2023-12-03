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

import './process-instance-diagram.scss'
import '../camunda.scss'

import BpmnModeler from 'bpmn-js/lib/Modeler';
import camundaModdlePackage from 'camunda-bpmn-moddle/resources/camunda';
import quantMEModdleExtension from './quantum4bpmn.json';
import openTOSCAModdleExtension from './opentosca4bpmn.json';
import quantMEModule from './quantme';
import openTOSCAModule from './opentosca';

export async function renderOverlay(viewer, camundaAPI, processInstanceId) {
    console.log('Rendering view overlay using viewer: ', viewer)
    console.log('View corresponds to process instance ID: ', processInstanceId)
    console.log('Camunda APIs to generate overlays: ', camundaAPI);

    // get active process view name and corresponding Xml from backend
    let response = await getActiveProcessView(camundaAPI, processInstanceId);
    let activeView = response['activeProcessView'];
    let activeViewXml = response['activeProcessViewXml'];
    console.log("Active view to visualize process view overlay for: ", activeView);

    // do not add overlays if executed workflow equals current view
    if (!activeView.includes('view-before-rewriting')) {
        console.log("Current view equals executed workflow. No overlay required!");
        return;
    }

    // get element registry and overlays to retrieve elements and attach new overlays to them
    let overlays = viewer.get("overlays")
    let viewerElementRegistry = viewer.get("elementRegistry")
    console.log("Successfully prepared viewer to add overlay!");

    // get the flow element representing the whole BPMN plane
    let elementArray = viewerElementRegistry.getAll();
    console.log('Diagram contains the following elements: ', elementArray);
    elementArray = elementArray.filter(element => element.type === 'bpmn:Process');
    console.log('Found ' + elementArray.length + ' flow elements of type "bpmn:Process"!');
    if (elementArray.length === 0) {
        console.error('Unable to find element of type "bpmn:Process" to add overlay. Aborting!');
        return;
    }
    let rootElement = elementArray[0];
    console.log('Creating overlay based on root element: ', rootElement)

    // add overlay to remove existing elements from the diagram
    overlays.add(rootElement, 'background-overlay', {
        position: {left: 0, top: 0},
        html: '<div class="background-div"></div>'
    });

    console.log("View to generate overlay for is represented by the following XML: ", activeViewXml);

    // create modeler capable of understanding the QuantME modeling constructs
    let quantmeModeler = await createQuantmeModelerFromXml(activeViewXml);
    console.log('Successfully created QuantME modeler to visualize QuantME constructs in process views: ', quantmeModeler);
    let quantmeElementRegistry = quantmeModeler.get('elementRegistry');

    // export view as Svg
    let viewSvg = await getSvg(quantmeModeler);
    viewSvg = updateViewBox(viewSvg, quantmeElementRegistry)
    console.log('Created Svg for process view: ', viewSvg);

    // add overlay to the retrieved root element
    overlays.add(rootElement, 'process-view-overlay', {
        position: {left: 0, top: 0},
        html: viewSvg
    });

    // get the currently active activities for the process instance
    let activeActivity = await getActiveActivities(camundaAPI, processInstanceId);
    console.log('Currently active activities to visualize: ', activeActivity);

    // visualize process token for retrieved active activities
    activeActivity.forEach(activeActivity =>
        visualizeActiveActivities(activeActivity['activityId'], overlays, quantmeElementRegistry, viewerElementRegistry, rootElement, processInstanceId, camundaAPI));
}

/**
* Add event handling to diagram elements to display overlay
*
* @param diagramElements contains the diagram elements to retrieve data
*/
async function computeOverlay(camundaAPI, processInstanceId, diagramElements, elementArray) {
    console.log("Register overlay for diagram elements ", diagramElements);
    let variables = await getVariables(camundaAPI, processInstanceId);

    // the default qpu
    let selectedQpu = "ibmq_qasm_simulator";
    if (variables["selected_qpu"]) {
        selectedQpu = variables["selected_qpu"];
    }
    let filteredDiagramElements = diagramElements.filter(diagramElement => {
        let attrs = diagramElement.businessObject.$attrs;
        return attrs !== undefined && attrs["quantme:quantmeTaskType"] !== undefined;
    });
    for (let diagramElement of filteredDiagramElements) {
        let top = diagramElement.y + diagramElement.height + 11;
        let x = diagramElement.x;
        let overlayTop = diagramElement.y - 150;
        console.log(variables)

        let variablesToDisplay = [];
        console.log(elementArray)
        for (let element of elementArray) {
            console.log("get extensionElements");
            console.log(element);
            if (element.type === "bpmn:ServiceTask" && diagramElement.id === element.id) {
                console.log("ids are matching")
                let extensionElements = element.businessObject.extensionElements.values;
                console.log("the extensionelements are:", extensionElements);

                for (let extensionElement of extensionElements) {
                    console.log(extensionElement);

                    // requires to retrieve the children
                    if (extensionElement.$type === "camunda:connector") {
                        for (let children of extensionElement.$children) {
                            console.log(children);
                            if (children.$type === "camunda:inputOutput") {
                                for (let inoutParam of children.$children) {
                                    if (inoutParam.$type === "camunda:outputParameter") {
                                        variablesToDisplay.push(inoutParam.name);
                                    }
                                }
                            }
                            if (children.$type === "camunda:outputParameter") {
                                variablesToDisplay.push(children.name);
                            }
                        }
                    }
                }

            }
        }

        // Generate the variable text for overlay
        let fileVariables = [];
        let variableText = variablesToDisplay.map(variableName => {
            if (variableName !== "circuit") {
                console.log("GET VARIABLE")
                console.log(variableName);
                const variable = variables[variableName];
                if (variable !== undefined) {
                    console.log(variable);
                    const variableValue = variable.value;
                    console.log(variableValue)
                    const variableType = variable.type;
                    console.log(variableType);
                    if (variableType !== "File") {
                        const formattedValue = typeof variableValue === 'object' ? JSON.stringify(variableValue) : variableValue;
                        return `<strong>${variableName}</strong>: ${formattedValue}`
                    } else {
                        fileVariables.push(variableName);
                    }
                }
            }
        }).join('<br>');

        for (let fileVariable of fileVariables) {
            console.log("----fileVariable")
            let variableInstanceId = await getVariableInstanceId(camundaAPI, processInstanceId, fileVariable);
            let value = await getVariableInstanceData(camundaAPI, processInstanceId, variableInstanceId);
            console.log(value);
            variableText = variableText + '<br>' + (`${fileVariable}: <img class="quantum-view-picture" src=${value} style="width: 50%;/>`)
        }

        let providerId = await getQProvProviderId("http://localhost:8094/qprov", "ibmq");
        console.log("the response from QProv");
        console.log(providerId);

        let qprovData = await getQPUData("http://localhost:8094/qprov", providerId, selectedQpu);
        console.log("QProv Data")
        console.log(qprovData);
        const qProvText = generateOverlayText(qprovData);
        console.log("DAS DIAGRAM");
        console.log(diagramElement);

        let attributes = diagramElement.businessObject.$attrs;
        console.log(attributes);
        if (attributes["quantme:containedElements"] !== undefined) {
            if (attributes["quantme:containedElements"].includes(diagramElement.id)) {

                //let entryPoint = entryPoints[0];
                // add overlay to the retrieved root element
                let entryPoint = quantmeElementRegistry.get(diagramElement.id);
                console.log(entryPoint);

                for (let child of entryPoint.children) {
                    let childTop = child.y + child.height + 11;
                    console.log(child)
                    console.log(child.businessObject.$attrs['quantme:quantmeTaskType']);

                    if (child.businessObject.$attrs['quantme:quantmeTaskType'] !== undefined) {
                        if (child.businessObject.$attrs['quantme:quantmeTaskType'].startsWith("quantme")) {
                            const html = `<div class="djs-overlays" style="position: absolute;" data-container-id="${child.id}">
                <div class="djs-overlay" data-overlay-id="ov-468528788-1" style="position: absolute; left: ${child.x}px; top: ${childTop}px; transform-origin: left top;">
                    <div class="activity-bottom-left-position instances-overlay">
                        <span class="badge instance-count" data-original-title="" title="">1</span>
                        <span class="badge badge-important instance-incidents" style="display: none;"></span>
                    </div>
                </div>
                <div class="data-overlay" style="position: absolute; left: ${child.x}px; top: ${childTop}px"><p>${qProvText}</p></div>
            </div>`;
                            entryPoint.html = html;
                            // Append the overlay HTML to the selected element
                            // selectedElement.insertAdjacentHTML('beforeend', html);
                        }
                    }
                }
            }
        } else {

            let overlaySize = variablesToDisplay.length * 40;
            let positionTop = overlayTop - (overlaySize / 2) + 20;
            let leftPosition = diagramElement.x - 50;

            const html = `<div class="djs-overlays" style="position: absolute;" data-container-id="${diagramElement.id}">
            <div class="data-overlay" style="position: absolute; left: ${leftPosition}px; top: ${positionTop}px; height: ${overlaySize}px">${variableText}</p></div>
            </div>`;
            if (variableText !== '') {
                console.log("VARIABLESTEXT");
                console.log(diagramElement.id);
                console.log(diagramElement);
                diagramElement.html = html;
            }
            if (attributes["quantme:quantmeTaskType"] !== undefined) {
                if (attributes["quantme:quantmeTaskType"] === "quantme:QuantumCircuitExecutionTask") {
                    overlaySize = 10 * 20;
                    positionTop = overlayTop - (overlaySize / 2) - 10;
                    let exehtml = `<div class="djs-overlays" style="position: absolute;" data-container-id="${diagramElement.id}">
                    <div class="data-overlay" style="position: absolute; left: ${leftPosition}px; top: ${positionTop}px; height: ${overlaySize}px">${qProvText}</p></div>
                </div>`;
                    diagramElement.html = exehtml;
                }
            }
        }
    }
}


/**
* Add event handling to diagram elements to display overlay
*
* @param diagramElements contains the diagram elements to retrieve data
*/
function registerOverlay(diagramElements) {
    console.log("Register overlay for diagram elements ", diagramElements);
    const selector = `.djs-overlay-container`;
    const selectedElement = document.querySelector(selector);
    for (let diagramElement of diagramElements) {
        console.log(diagramElement);
        let visualElements = document.querySelector(`g.djs-element[data-element-id="${diagramElement.id}"]`);

        let attrs = diagramElement.businessObject.$attrs;
        if (attrs !== undefined) {
            console.log(attrs["quantme:quantmeTaskType"]);


            if (visualElements !== null && attrs["quantme:quantmeTaskType"] !== undefined) {
                console.log(visualElements);
                console.log(addedHtml);
                const addedHtml = diagramElement.html;
                var tempElement = document.createElement('div');
                tempElement.innerHTML = diagramElement.html;
                var domElement = tempElement.firstChild;
                if (addedHtml !== null && addedHtml !== undefined) {
                    visualElements.addEventListener('mouseenter', function () {
                        console.log(selectedElement.innerHTML);
                        if (!selectedElement.innerHTML.includes(addedHtml)) {
                            console.log("add")
                            console.log(diagramElement.html)
                            selectedElement.insertAdjacentHTML('beforeend', diagramElement.html);
                            console.log('Mouse entered a visual element!');
                        }
                    });
                    visualElements.addEventListener('mouseleave', function () {
                        console.log(selectedElement.innerHTML);
                        console.log(addedHtml)
                        console.log(selectedElement)
                        console.log(domElement);
                        // Iterate over each child of the parent element
                        for (var i = 0; i < selectedElement.children.length; i++) {
                            console.log("child")
                            var child = selectedElement.children[i];
                            console.log(child)

                            // Check if the child has the data-element-id attribute
                            if (child.hasAttribute("data-container-id")) {
                                var dataElementId = child.getAttribute("data-container-id");
                                var speechBubbleElement = child.querySelector('.data-overlay');
                                console.log(speechBubbleElement)
                                console.log(dataElementId);
                                console.log(diagramElement.id)

                                // Check if the data-element-id matches the target value
                                if (dataElementId === diagramElement.id && speechBubbleElement !== null) {
                                    // Remove the matching child
                                    child.removeChild(speechBubbleElement);
                                    console.log("Child element removed successfully.");
                                }
                            }
                        }
                        console.log(selectedElement)
                        //selectedElement.innererHTML = selectedElement.innerHTML.replace(addedHtml, '');
                        console.log('Mouse left a visual element!');
                    });
                }
            }
        }
    }
}


/**
* Get the currently active activities for the given process instance
*
* @param camundaAPI the Camunda APIs to access the backend
* @param processInstanceId the ID of the process instance to retrieve the active activity for
* @returns an array with currently active activities
*/
async function getActiveActivities(camundaAPI, processInstanceId) {
    const activityInstanceEndpoint = `/engine-rest/process-instance/${processInstanceId}/activity-instances`
    console.log("Retrieving active activity from URL: ", activityInstanceEndpoint)
    let res = await fetch(activityInstanceEndpoint,
        {
            headers: {
                'Accept': 'application/json',
                "X-XSRF-TOKEN": camundaAPI.CSRFToken,
            }
        }
    )
    return (await res.json())['childActivityInstances'];

}

/**
* Get the currently active activities for the given process instance
*
* @param buildPlanInstanceUrl the Camunda APIs to access the backend
* @param processInstanceId the ID of the process instance to retrieve the active activity for
* @returns an array with currently active activities
*/
async function getVMNetworkId(buildPlanInstanceUrl) {
    console.log("Retrieving properties from URL: ", buildPlanInstanceUrl)
    let res = await fetch(buildPlanInstanceUrl,
        {
            headers: {
                'Accept': 'application/json',
            }
        }
    )
    return (await res.json()).inputs.find(input => input.name === "VMNetworks").value;
}

/**
* Get the currently active transition activities for the given process instance
*
* @param camundaAPI the Camunda APIs to access the backend
* @param processInstanceId the ID of the process instance to retrieve the active transition activity for
* @returns an array with currently active transition activities
*/
async function getActiveTransitionActivities(camundaAPI, processInstanceId) {
    const activityInstanceEndpoint = `/engine-rest/process-instance/${processInstanceId}/activity-instances`
    console.log("Retrieving active activity from URL: ", activityInstanceEndpoint)
    let res = await fetch(activityInstanceEndpoint,
        {
            headers: {
                'Accept': 'application/json',
                "X-XSRF-TOKEN": camundaAPI.CSRFToken,
            }
        }
    )
    return (await res.json())['childTransitionInstances'];

}

// engine-rest/variable-instance?processInstanceIdIn=c7ea31a1-8ba6-11ee-bffc-0242ac110002&variableName=circuitVisualization

/**
 * Get the variable instance id from the process instance
 *
 * @param camundaAPI the Camunda APIs to access the backend
 * @param processInstanceId the ID of the process instance to retrieve the active activity for
 * @returns an array with variables
 */
async function getVariableInstanceId(camundaAPI, processInstanceId, variableName) {
    const activityInstanceEndpoint = `/engine-rest/variable-instance?processInstanceId=${processInstanceId}&variableName=${variableName}`
    console.log("Retrieving variables from URL: ", activityInstanceEndpoint)
    let res = await fetch(activityInstanceEndpoint,
        {
            headers: {
                'Accept': 'application/json',
                "X-XSRF-TOKEN": camundaAPI.CSRFToken,
            }
        }
    )
    return (await res.json())[0].id;
}

/**
 * Get the variable instance id from the process instance
 *
 * @param camundaAPI the Camunda APIs to access the backend
 * @param processInstanceId the ID of the process instance to retrieve the active activity for
 * @returns an array with variables
 */
async function getVariableInstanceData(camundaAPI, processInstanceId, variableInstanceId) {
    const activityInstanceEndpoint = `/engine-rest/variable-instance/${variableInstanceId}/data`
    console.log("Retrieving variables from URL: ", activityInstanceEndpoint)
    let res = await fetch(activityInstanceEndpoint,
        {
            headers: {
                'Accept': 'application/json',
                "X-XSRF-TOKEN": camundaAPI.CSRFToken,
            }
        }
    )
    return (await res.url);
}


/**
 * Get the variable instance id from the process instance
 *
 * @param camundaAPI the Camunda APIs to access the backend
 * @param processInstanceId the ID of the process instance to retrieve the active activity for
 * @returns an array with variables
 */
async function getVariables(camundaAPI, processInstanceId) {
    const activityInstanceEndpoint = `/engine-rest/process-instance/${processInstanceId}/variables`
    console.log("Retrieving variables from URL: ", activityInstanceEndpoint)
    let res = await fetch(activityInstanceEndpoint,
        {
            headers: {
                'Accept': 'application/json',
                "X-XSRF-TOKEN": camundaAPI.CSRFToken,
            }
        }
    )
    return (await res.json());
}

/**
 * Get the id of the selected provider from QProv.
 *
 * @param qProvEndpoint the QProv endpoint to access the data
 * @param provider the ID of the provider to retrieve the id for
 * @returns the id of the provider
 */
async function getVMQProvData(qProvEndpoint, vmNetworkId) {
    const apiEndpoint = `${qProvEndpoint}/virtual-machines/${vmNetworkId}/characteristics`; // Updated variable name
    console.log(apiEndpoint);
    try {
        const response = await fetch(apiEndpoint);
        const data = await response.json();

        // Extract the list of hardware characteristics
        const hardwareCharacteristics = data._embedded.hardwareCharacteristicsDtoes;

        // Sort the array based on the recordingTime in descending order
        const sortedData = hardwareCharacteristics.sort((a, b) => new Date(b.recordingTime) - new Date(a.recordingTime));

        // Get the data with the latest timestamp
        const latestData = sortedData[0];

        // Log the result
        console.log(latestData);

        if (latestData) {
            return latestData;
        } else {
            console.log(`No data collected.`);
            return null;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

/**
 * Get the id of the selected provider from QProv.
 *
 * @param qProvEndpoint the QProv endpoint to access the data
 * @param provider the ID of the provider to retrieve the id for
 * @returns the id of the provider
 */
async function getQProvProviderId(qProvEndpoint, providerName) {
    const apiEndpoint = `${qProvEndpoint}/providers`; // Updated variable name
    console.log(apiEndpoint);
    try {
        const response = await fetch(apiEndpoint);
        const data = await response.json();

        // Find the provider with the given name
        const ibmqProvider = data._embedded.providerDtoes.find(provider => provider.name === providerName);
        console.log(ibmqProvider);

        if (ibmqProvider) {
            // Extract the ID from the found provider
            const ibmqId = ibmqProvider.id;
            console.log(ibmqId)
            return ibmqId;
        } else {
            console.log(`Provider with name "${providerName}" not found.`);
            return null;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}


/**
 * Get the id of the selected provider from QProv.
 *
 * @param qProvEndpoint the QProv endpoint to access the data
 * @param provider the ID of the provider to retrieve the id for
 * @returns the id of the provider
 */
async function getQPUData(qProvEndpoint, providerId, qpuName) {
    //http://localhost:8094/qprov/providers/4c490baf-9859-4e2f-9777-6309f93ceeea/qpus
    const apiEndpoint = `${qProvEndpoint}/providers/${providerId}/qpus`; // Updated variable name
    console.log(apiEndpoint);
    try {
        const response = await fetch(apiEndpoint);
        const data = await response.json();

        // Find the QPU with the given name
        const ibmqQpu = data._embedded.qpuDtoes.find(qpu => qpu.name === qpuName);

        if (ibmqQpu) {
            // Extract the relevant data from the QPU
            const { name, queueSize, numberOfQubits, avgT1Time, avgT2Time, avgReadoutError, avgSingleQubitGateError, avgMultiQubitGateError, avgSingleQubitGateTime, avgMultiQubitGateTime, maxGateTime } = ibmqQpu;
            return { name, queueSize, numberOfQubits, avgT1Time, avgT2Time, avgReadoutError, avgSingleQubitGateError, avgMultiQubitGateError, avgSingleQubitGateTime, avgMultiQubitGateTime, maxGateTime };
        } else {
            console.log(`QPU with name "${qpuName}" not found.`);
            return null;
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

function generateOverlayText(obj) {
    const variableText = Object.entries(obj)
        .map(([variable, value]) => {
            if (typeof value === 'number') {
                value = value.toFixed(4);
            }
            return `<strong>${variable}:</strong> ${value}`;
        })
        .join('<br>');

    return variableText;
}

/**
 * Visualize the process token for the given active activity as an overlay
 *
 * @param activeActivityId the ID of the activity to visualize the process token for
 * @param overlays the set of overlays to add the visualization
 * @param quantmeElementRegistry the element registry of the process view to retrieve the coordinates for the token
 * @param viewerElementRegistry the element registry of the viewer to retrieve all required details about the active activity
 * @param rootElement the root element to use as parent for adding overlays
 * @param processInstanceId the ID of the process instance for which the process token is visualized
 * @param camundaAPI the Camunda APIs to access the backend
 */
async function visualizeActiveActivities(activeActivityId, overlays, quantmeElementRegistry, viewerElementRegistry, rootElement, elementArray, processInstanceId, camundaAPI) {
    console.log('Visualizing process token for active activity with ID: ', activeActivityId);

    // get activity from executed workflow related to given ID
    let activeActivity = viewerElementRegistry.get(activeActivityId);
    console.log('Retrieved corresponding activity object: ', activeActivity);

    let activeActivityBo = activeActivity.businessObject;
    let activeActivityAttributes = activeActivityBo.$attrs;
    console.log('Found attributes: ', activeActivityAttributes);

    const selector = `.djs-overlay-container`;
    const selectedElement = document.querySelector(selector);
    let top = activeActivity.y + activeActivity.height + 11;
    let x = activeActivity.x;

    // attach a process token to the currently active activity
    if (selectedElement) {
        const overlayHtml = `
        <div class="djs-overlays" style="position: absolute;" data-container-id="${activeActivityId}">
            <div class="djs-overlay" data-overlay-id="ov-468528788-1" style="position: absolute; left: ${x}px; top: ${top}px; transform-origin: left top;">
                <div class="activity-bottom-left-position instances-overlay">
                    <span class="badge instance-count" data-original-title="" title="">1</span>
                    <span class="badge badge-important instance-incidents" style="display: none;"></span>
                </div>
            </div>
        </div>`;

        // Append the overlay HTML to the selected element
        selectedElement.insertAdjacentHTML('beforeend', overlayHtml);
    }

    // set the token on the task of the subprocess
    if (activeActivityAttributes['quantme:containedElements'] !== undefined) {
        let subProcess = quantmeElementRegistry.get(activeActivityId);
        console.log(subProcess);

        // currently the subprocess contains exactly one quantme task
        for (let child of subProcess.children) {
            let childTop = child.y + child.height + 11;

            if (child.businessObject.$attrs['quantme:quantmeTaskType'] !== undefined) {
                if (child.businessObject.$attrs['quantme:quantmeTaskType'].startsWith("quantme")) {
                    const html = `<div class="djs-overlays" style="position: absolute;" data-container-id="${child.id}">
                        <div class="djs-overlay" data-overlay-id="ov-468528788-1" style="position: absolute; left: ${child.x}px; top: ${childTop}px; transform-origin: left top;">
                            <div class="activity-bottom-left-position instances-overlay">
                                <span class="badge instance-count" data-original-title="" title="">1</span>
                                <span class="badge badge-important instance-incidents" style="display: none;"></span>
                            </div>
                        </div>
                    </div>`;
                    selectedElement.insertAdjacentHTML('beforeend', html);
                }
            }
        }
    }
}


/**
 * Get the currently active process view and the corresponding Xml file from the backend
 *
 * @param camundaAPI the Camunda APIs to access the backend
 * @param processInstanceId the ID of the process instance to retrieve the active process view for
 * @returns the Json returned by the backend comprising the active process view and the corresponding Xml file
 */
async function getActiveProcessView(camundaAPI, processInstanceId) {
    const cockpitApi = camundaAPI.cockpitApi;
    const processViewEndpoint = `${cockpitApi}/plugin/camunda-process-views-plugin/default/process-instance/${processInstanceId}/active-view`;
    console.log('Retrieving currently active view using URL: ', processViewEndpoint);
    let res = await fetch(processViewEndpoint,
        {
            headers: {
                'Accept': 'application/json',
                "X-XSRF-TOKEN": camundaAPI.CSRFToken,
            }
        }
    )
    return await res.json();
}

/**
 * Get the currently active activities for the given process instance
 *
 * @param camundaAPI the Camunda APIs to access the backend
 * @param processInstanceId the ID of the process instance to retrieve the active activity for
 * @returns an array with currently active activities
 */
async function getActiveActivities(camundaAPI, processInstanceId) {
    const activityInstanceEndpoint = `/engine-rest/process-instance/${processInstanceId}/activity-instances`
    console.log("Retrieving active activity from URL: ", activityInstanceEndpoint)
    let res = await fetch(activityInstanceEndpoint,
        {
            headers: {
                'Accept': 'application/json',
                "X-XSRF-TOKEN": camundaAPI.CSRFToken,
            }
        }
    )
    return (await res.json())['childActivityInstances'];
}

/**
 * Visualize the process token for the given active activity as an overlay
 *
 * @param activeActivityId the ID of the activity to visualize the process token for
 * @param overlays the set of overlays to add the visualization
 * @param quantmeElementRegistry the element registry of the process view to retrieve the coordinates for the token
 * @param viewerElementRegistry the element registry of the viewer to retrieve all required details about the active activity
 * @param rootElement the root element to use as parent for adding overlays
 * @param processInstanceId the ID of the process instance for which the process token is visualized
 * @param camundaAPI the Camunda APIs to access the backend
 */
async function visualizeActiveActivities(activeActivityId, overlays, quantmeElementRegistry, viewerElementRegistry, rootElement, processInstanceId, camundaAPI) {
    console.log('Visualizing process token for active activity with ID: ', activeActivityId);

    // get activity from executed workflow related to given ID
    let activeActivity = viewerElementRegistry.get(activeActivityId).businessObject;
    console.log('Retrieved corresponding activity object: ', activeActivity);

    // retrieve attributes comprising relevant information about hybrid programs
    let activeActivityAttributes = activeActivity.$attrs;
    console.log('Found attributes: ', activeActivityAttributes);

    // handle activities related to hybrid program executions and regular activities differently
    if (activeActivityAttributes['quantme:hybridRuntimeExecution'] !== undefined && activeActivityAttributes['quantme:hybridRuntimeExecution'] === 'true') {
        let hybridProgramId = activeActivityAttributes['quantme:hybridProgramId']
        console.log('Active activity belongs to hybrid program execution with ID: ', hybridProgramId);

        // get current value of the variable containing the ID of the activity that is currently executed within the hybrid program
        const variableEndpoint = `/engine-rest/process-instance/${processInstanceId}/variables/${hybridProgramId}`
        let res = await fetch(variableEndpoint,
            {
                headers: {
                    'Accept': 'application/json',
                    "X-XSRF-TOKEN": camundaAPI.CSRFToken,
                }
            }
        )

        // if variable is not yet set, the hybrid program is within the queue --> add token to first activity belonging to hybrid program
        if (!res.ok) {
            console.log('Received following status code when retrieving variable comprising currently active activity: ', res.status);

            // find the entry point for the workflow part belonging to the hybrid program
            let entryPoints = quantmeElementRegistry.getAll().map(element => element.businessObject)
                .filter(element => (element.$attrs['quantme:hybridRuntimeExecution'] !== undefined && element.$attrs['quantme:hybridRuntimeExecution'] === 'true')
                    || (element.$attrs['hybridRuntimeExecution'] !== undefined && element.$attrs['hybridRuntimeExecution'] === 'true'))
                .filter(element => (element.$attrs['quantme:hybridProgramId'] !== undefined && element.$attrs['quantme:hybridProgramId'] === hybridProgramId)
                    || (element.$attrs['hybridProgramId'] !== undefined && element.$attrs['hybridProgramId'] === hybridProgramId));
            console.log('Found ' + entryPoints.length + ' activities belonging to hybrid program ID: ', entryPoints);
            entryPoints = entryPoints.filter(element => (element.$attrs['quantme:hybridProgramEntryPoint'] !== undefined && element.$attrs['quantme:hybridProgramEntryPoint'] === 'true')
                    || (element.$attrs['hybridProgramEntryPoint'] !== undefined && element.$attrs['hybridProgramEntryPoint'] === 'true'));
            console.log('Found ' + entryPoints.length + ' entry point for given hybrid program ID!')

            // there must be exactly one entry point
            if (entryPoints.length !== 1) {
                console.error('There must be exactly one entry point for the hybrid program!');
                return;
            }
            let entryPoint = entryPoints[0];
            console.log('Found entry point to add process token: ', entryPoint);

            // add overlay to the retrieved root element
            entryPoint = quantmeElementRegistry.get(entryPoint.id);
            overlays.add(rootElement, 'process-view-overlay', {
                position: {left: entryPoint.x - 10, top: entryPoint.y + entryPoint.height - 10},
                html: '<span class="badge instance-count" data-original-title="" title="">1</span>'
            });
        } else {
            // add token to retrieved activity
            let result = await res.json();
            console.log('Currently active activity within hybrid program has ID: ', result['value']);

            // search the corresponding activity in the process view
            let activityInView = quantmeElementRegistry.get(result['value']);
            console.log('Found activity with given ID in process view: ', activityInView);

            // add overlay to the retrieved root element
            overlays.add(rootElement, 'process-view-overlay', {
                position: {left: activityInView.x - 10, top: activityInView.y + activityInView.height - 10},
                html: '<span class="badge instance-count" data-original-title="" title="">1</span>'
            });
        }
    } else{
        // if activity is not part of a hybrid program execution it was not changed during rewrite and an activity with the same ID is part of the process view
        console.log('Active activity is regular activity of the executed workflow. Adding process token...');
        let activityInView = quantmeElementRegistry.get(activeActivityId);
        console.log('Found activity with same ID in process view: ', activityInView);

        // add overlay to the retrieved root element
        overlays.add(rootElement, 'process-view-overlay', {
            position: {left: activityInView.x - 10, top: activityInView.y + activityInView.height - 10},
            html: '<span class="badge instance-count" data-original-title="" title="">1</span>'
        });
    }
}

/**
 * Get the Svg representing the diagram in the given modeler
 *
 * @param modeler the modeler to retrieve the Svg for
 * @returns the exported Svg
 */
async function getSvg(modeler) {
    function saveSvgWrapper() {
        return new Promise((resolve) => {
            modeler.saveSVG((err, successResponse) => {
                resolve(successResponse);
            });
        });
    }

    return await saveSvgWrapper();
}

/**
 * Update the viewbox of the given Svg to properly display the contained BPMN diagram
 *
 * @param svg an Svg to update the viewbox for, which is wrongly set by the modeler on export
 * @param elementRegistry the element registry to access all elements within the diagram the Svg belongs to
 * @returns the Svg with the updated viewbox
 */
function updateViewBox(svg, elementRegistry) {

    // search for the modeling elements with the minimal and maximal x and y values
    let result = {};
    let elements = elementRegistry.getAll().filter(element => element.type !== 'bpmn:Process');
    console.log('Updating view box using the following elements: ', elements);
    for (let i = 0; i < elements.length; i++) {
        let element = elements[i];
        console.log('Checking element: ', element);

        // for sequence flows check the position of each waypoint and label
        if (element.type === 'bpmn:SequenceFlow') {
            if (element.waypoints) {
                for (let j = 0; j < element.waypoints.length; j++) {
                    let waypoint = element.waypoints[j];

                    if (result.minX === undefined || result.minX > waypoint.x) {
                        result.minX = waypoint.x;
                    }

                    if (result.minY === undefined || result.minY > waypoint.y) {
                        result.minY = waypoint.y;
                    }

                    if (result.maxX === undefined || result.maxX < waypoint.x) {
                        result.maxX = waypoint.x;
                    }

                    if (result.maxY === undefined || result.maxY < waypoint.y) {
                        result.maxY = waypoint.y;
                    }
                }
            }
        } else {

            // handle non sequence flow elements
            result = updateViewBoxCoordinates(result, element);
        }

        // handle labels attached to arbitrary elements
        if (element.labels) {
            for (let j = 0; j < element.labels.length; j++) {
                result = updateViewBoxCoordinates(result, element.labels[j]);
            }
        }
    }

    console.log('Maximum x value for candidate: ', result.maxX);
    console.log('Maximum y value for candidate: ', result.maxY);

    let width, height;
    if (result.maxX === undefined || result.maxY === undefined) {
        console.log('Error: unable to find modeling element with minimum and maximum x and y values!');

        // default values in case an error occurred
        width = 1000;
        height = 1000;
    } else {

        // calculate view box and add a margin of 10 to the min/max values
        width = result.maxX + 1000;
        height = result.maxY + 1000;
    }

    return svg.replace('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0" viewBox="0 0 0 0" version="1.1">',
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + width + '" height="' + height + '" viewBox="0 0 ' + width + ' ' + height + '" version="1.1">');
}

/**
 * Update the view box coordinates with the coordinates of the given element if they provide higher/lower values for max/min
 *
 * @param coordindates the current view box coordinates, i.e., the min/max for x and y
 * @param element the element to check if it provides new coordinates for the view box
 * @return the updated view box coordinates
 */
function updateViewBoxCoordinates(coordindates, element) {

    if (coordindates.minX === undefined || coordindates.minX > element.x) {
        coordindates.minX = element.x;
    }

    if (coordindates.minY === undefined || coordindates.minY > element.y) {
        coordindates.minY = element.y;
    }

    // max x and y also incorporate the width of the current element
    if (coordindates.maxX === undefined || coordindates.maxX < element.x + element.width) {
        coordindates.maxX = element.x + element.width;
    }

    if (coordindates.maxY === undefined || coordindates.maxY < element.y + element.height) {
        coordindates.maxY = element.y + element.height;
    }

    return coordindates;
}

/**
 * Create a new modeler object and import the given XML BPMN diagram
 *
 * @param xml the xml representing the BPMN diagram
 * @return the modeler containing the BPMN diagram
 */
async function createQuantmeModelerFromXml(xml) {

    // create new modeler with the custom QuantME extensions
    const bpmnModeler = createQuantmeModeler();

    // import the xml containing the definitions
    function importXmlWrapper(xml) {
        return new Promise((resolve) => {
            bpmnModeler.importXML(xml, (successResponse) => {
                resolve(successResponse);
            });
        });
    }

    await importXmlWrapper(xml);

    return bpmnModeler;
}

/**
 * Create a new modeler object using the QuantME extensions
 *
 * @return {Modeler} the created modeler
 */
function createQuantmeModeler() {
    return new BpmnModeler({
        additionalModules: [
            quantMEModule,
            openTOSCAModule
        ],
        moddleExtensions: {
            camunda: camundaModdlePackage,
            quantME: quantMEModdleExtension,
            opentosca: openTOSCAModdleExtension
        }
    });
}
