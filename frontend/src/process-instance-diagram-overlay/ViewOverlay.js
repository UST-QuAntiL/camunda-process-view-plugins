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
import QuantMERenderer from './quantme/QuantMERenderer';

/**
 * Determines the actual view and updates the displayed xml of the viewer.
 * 
 * @param viewer contains the xml
 * @param camundaAPI api to retrieve the variables and activities
 * @param processInstanceId identifies the running process instance
 */
export async function renderOverlay(viewer, camundaAPI, processInstanceId) {
    console.log('Rendering view overlay using viewer: ', viewer)
    console.log('View corresponds to process instance ID: ', processInstanceId)
    console.log('Camunda APIs to generate overlays: ', camundaAPI);

    // get active process view name and corresponding Xml from backend
    let response = await getActiveProcessView(camundaAPI, processInstanceId);
    let activeView = response['activeProcessView'];
    let activeViewXml = response['activeProcessViewXml'];
    console.log("Active view to visualize process view overlay for: ", activeView);

    // do not change xml if executed workflow equals current view
    if (!activeView.includes('view-before-rewriting')) {
        console.log("Current view equals executed workflow. No overlay required!");
        return;
    }

    // get element registry and overlays to retrieve elements and attach new overlays to them
    let overlays = viewer.get("overlays");
    let canvas = viewer.get("canvas");
    let viewerElementRegistry = viewer.get("elementRegistry");
    console.log("Successfully prepared viewer to add overlay!");

    // get the flow element representing the whole BPMN plane
    let elementArray = viewerElementRegistry.getAll();
    console.log('Diagram contains the following elements: ', elementArray);

    let allElements = viewerElementRegistry.getAll();
    elementArray = elementArray.filter(element => element.type === 'bpmn:Process');
    console.log('Found ' + elementArray.length + ' flow elements of type "bpmn:Process"!');

    if (elementArray.length === 0) {
        console.error('Unable to find element of type "bpmn:Process" to add overlay. Aborting!');
        return;
    }
    let rootElement = elementArray[0];
    console.log('Creating overlay based on root element: ', rootElement)

    // add overlay to remove existing elements from the diagram
    console.log("View to generate overlay for is represented by the following XML: ", activeViewXml);
    console.log(viewer.get("canvas"))
    viewer.importXML(activeViewXml)
    viewerElementRegistry = viewer.get("elementRegistry")
    let quantmeElementArray = viewerElementRegistry.getAll();
    console.log('Diagram contains the following elements: ', elementArray);


    // create modeler capable of understanding the QuantME modeling constructs
    let quantmeModeler = await createQuantmeModelerFromXml(activeViewXml);
    console.log('Successfully created QuantME modeler to visualize QuantME constructs in process views: ', quantmeModeler);
    let quantmeElementRegistry = quantmeModeler.get('elementRegistry');
    let bpmnReplace = quantmeModeler.get("bpmnReplace");
    quantmeElementArray = viewerElementRegistry.getAll();

    // get the xml of the modeler and update the view
    viewer.importXML(activeViewXml);
    overlays = viewer.get("overlays");

    // register the events and rendering
    new QuantMERenderer(viewer.get("eventBus"), viewer.get("styles"), viewer.get("bpmnRenderer"), viewer.get("textRenderer"), canvas);

    // get the currently active activities for the process instance
    let activeActivity = await getActiveActivities(camundaAPI, processInstanceId);
    console.log('Currently active activities to visualize: ', activeActivity);

    // if the workflow contains loops, transition activities can hold the active activity
    if (activeActivity.length === 0) {
        activeActivity = await getActiveTransitionActivities(camundaAPI, processInstanceId);
    }
    console.log('Currently active transition activities to visualize: ', activeActivity);

    // visualize process token for retrieved active activities
    activeActivity.forEach(activeActivity =>
        visualizeActiveActivities(activeActivity['activityId'], overlays, quantmeElementRegistry, viewerElementRegistry, rootElement, allElements, processInstanceId, camundaAPI));
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
async function getQProvProviderId(qProvEndpoint, providerName) {
    const apiEndpoint = `${qProvEndpoint}/providers`; // Updated variable name
    try {
        const response = await fetch(apiEndpoint);
        const data = await response.json();

        // Find the provider with the given name
        const ibmqProvider = data._embedded.providerDtoes.find(provider => provider.name === providerName);

        if (ibmqProvider) {
            // Extract the ID from the found provider
            const ibmqId = ibmqProvider.id;
            return ibmqId;
        } else {
            console.log(`Provider with name "${providerName}" not found.`);
            return null; // You might want to return a specific value in case the provider is not found
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return null; // Handle the error as needed
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
    try {
        const response = await fetch(apiEndpoint);
        const data = await response.json();

        // Find the QPU with the given name
        const ibmqQpu = data._embedded.qpuDtoes.find(qpu => qpu.name === qpuName);

        if (ibmqQpu) {
            // Extract the relevant data from the QPU
            const { name, queueSize, avgT1Time, avgT2Time } = ibmqQpu;
            return { name, queueSize, avgT1Time, avgT2Time };
        } else {
            console.log(`QPU with name "${qpuName}" not found.`);
            return null; // You might want to return a specific value in case the QPU is not found
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return null; // Handle the error as needed
    }
}

function generateOverlayText(obj) {
    const variableText = Object.entries(obj)
        .map(([variable, value]) => `<strong>${variable}:</strong> ${value}`)
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
    let activeActivity = viewerElementRegistry.get(activeActivityId).businessObject;
    console.log('Retrieved corresponding activity object: ', activeActivity);

    // retrieve attributes comprising relevant information about hybrid programs
    let activeActivityAttributes = activeActivity.$attrs;
    console.log('Found attributes: ', activeActivityAttributes);

    console.log(viewerElementRegistry.get(activeActivityId));
    const selector = `.djs-overlay-container`;

    const selectedElement = document.querySelector(selector);
    console.log(selectedElement)
    let top = viewerElementRegistry.get(activeActivityId).y + viewerElementRegistry.get(activeActivityId).height + 11;
    let x = viewerElementRegistry.get(activeActivityId).x;
    let overlayTop = viewerElementRegistry.get(activeActivityId).y - 150;

    let variables = await getVariables(camundaAPI, processInstanceId);
    console.log(variables)

    let variablesToDisplay = [];
    for (let element of elementArray) {
        console.log("get extensionElements");
        console.log(element);
        if (element.type === "bpmn:ServiceTask" && activeActivityId === element.id) {
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
            const variable = variables[variableName];
            const variableValue = variable.value;
            const variableType = variable.type;
            console.log(variableType);
            if (variableType !== "File") {
                const formattedValue = typeof variableValue === 'object' ? JSON.stringify(variableValue) : variableValue;
                return `${variableName}: ${formattedValue}`
            } else {
                fileVariables.push(variableName);
            }
        }
    }).join('<br>');

    for (let fileVariable of fileVariables) {
        console.log("----fileVariable")
        let variableInstanceId = await getVariableInstanceId(camundaAPI, processInstanceId, fileVariable);
        let value = await getVariableInstanceData(camundaAPI, processInstanceId, variableInstanceId);
        console.log(value);
        variableText = variableText + '<br>' + (`${fileVariable}: <img class="quantum-view-picture" src=${value} />`)
    }


    if (selectedElement) {
        const overlayHtml = `
        <div class="djs-overlays" style="position: absolute;" data-container-id="${activeActivityId}">
            <div class="djs-overlay" data-overlay-id="ov-468528788-1" style="position: absolute; left: ${x}px; top: ${top}px; transform-origin: left top;">
                <div class="activity-bottom-left-position instances-overlay">
                    <span class="badge instance-count" data-original-title="" title="">1</span>
                    <span class="badge badge-important instance-incidents" style="display: none;"></span>
                </div>
            </div>
            <div class="overlay-text" style="position: absolute; left: ${x}px; top: ${overlayTop}px">
                    ${variableText}
            </div>
        </div>`;

        // Append the overlay HTML to the selected element
        selectedElement.insertAdjacentHTML('beforeend', overlayHtml);
    }
    // find the entry point for the workflow part belonging to the hybrid program
    if (activeActivityAttributes['quantme:containedElements'] !== undefined) {

        let providerId = await getQProvProviderId("http://localhost:8094/qprov", "ibmq");
        console.log("the response from QProv");
        console.log(providerId)

        let qprovData = await getQPUData("http://localhost:8094/qprov", providerId, "ibmq_qasm_simulator");
        console.log("QProv Data")
        console.log(qprovData);
        const qProvText = generateOverlayText(qprovData);


        //if(activeActivityAttributes["quantme:containedElements"].includes(activeActivityId)){

        //let entryPoint = entryPoints[0];
        // add overlay to the retrieved root element
        let entryPoint = quantmeElementRegistry.get(activeActivityId);
        console.log(entryPoint);
        overlays.add(rootElement, {
            position: { left: entryPoint.x - 10, top: entryPoint.y + entryPoint.height - 10 },
            html: '<span class="badge instance-count" data-original-title="" title="">1</span>'
        });

        for (let child of entryPoint.children) {
            let childTop = child.y + child.height + 11;
            console.log(child)
            console.log(child.businessObject.$attrs['quantme:quantmeTaskType']);
            //<div class="overlay-text" style="position: absolute; left: ${child.x}px; top: ${childTop}px"> ${qProvText}</div>
            if (child.businessObject.$attrs['quantme:quantmeTaskType'] !== undefined) {
                if (child.businessObject.$attrs['quantme:quantmeTaskType'].startsWith("quantme")) {
                    const html = `<div class="djs-overlays" style="position: absolute;" data-container-id="${child.id}">
                <div class="djs-overlay" data-overlay-id="ov-468528788-1" style="position: absolute; left: ${child.x}px; top: ${childTop}px; transform-origin: left top;">
                    <div class="activity-bottom-left-position instances-overlay">
                        <span class="badge instance-count" data-original-title="" title="">1</span>
                        <span class="badge badge-important instance-incidents" style="display: none;"></span>
                    </div>
                </div>
            <div class="com_box" style="position: absolute; left: ${child.x}px; top: ${childTop}px">${qProvText}</div>
            </div>`;
                    // Append the overlay HTML to the selected element
                    selectedElement.insertAdjacentHTML('beforeend', html);
                }
            }
        }

        // to do add overlay for each selected element
        const gElement = document.querySelector('.djs-element');
        gElement.addEventListener('mouseenter', async function() {
            let variables2 = await getVariables(camundaAPI, processInstanceId);
            console.log(variables2)
            console.log('Mouse over the element!');
        });

        gElement.addEventListener('mouseleave', function() {
            console.log('Mouse out of the element!');
        });


        console.log("add overlay")
        //}
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

async function getXml(modeler) {
    console.log(modeler)
    function saveXmlWrapper() {
        return new Promise((resolve) => {
            modeler.saveXML((err, successResponse) => {
                resolve(successResponse);
            });
        });
    }

    return await saveXmlWrapper();
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
