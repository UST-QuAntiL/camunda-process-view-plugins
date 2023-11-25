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
    elementArray = elementArray.filter(element => element.type === 'bpmn:Process');
    console.log('Found ' + elementArray.length + ' flow elements of type "bpmn:Process"!');
    if (elementArray.length === 0) {
        console.error('Unable to find element of type "bpmn:Process" to add overlay. Aborting!');
        return;
    }
    let rootElement = elementArray[0];
    console.log('Creating overlay based on root element: ', rootElement)

    for (let element of elementArray) {
        console.log(element);
        if (element.type === "bpmn:Task") {
            parent = element.parent;
            //bpmnReplace.replaceElement(quantmeElementRegistry.get(element.id), {
            //  type: "bpmn:Task",
            //});
        }
        if (element.type === "bpmn:DataObjectReference") {
            bpmnReplace.replaceElement(quantmeElementRegistry.get(element.id), {
                type: "bpmn:DataObjectReference",
            });
        }
    }


    // add overlay to remove existing elements from the diagram
    console.log("View to generate overlay for is represented by the following XML: ", activeViewXml);
    console.log(viewer.get("canvas"))
    viewer.importXML(activeViewXml)
    viewerElementRegistry = viewer.get("elementRegistry")
    elementArray = viewerElementRegistry.getAll();
    console.log('Diagram contains the following elements: ', elementArray);


    // create modeler capable of understanding the QuantME modeling constructs
    let quantmeModeler = await createQuantmeModelerFromXml(activeViewXml);
    console.log('Successfully created QuantME modeler to visualize QuantME constructs in process views: ', quantmeModeler);
    let quantmeElementRegistry = quantmeModeler.get('elementRegistry');
    let bpmnReplace = quantmeModeler.get("bpmnReplace");
    elementArray = viewerElementRegistry.getAll();

    // get all tasks from the xml of the respective view and fire the replace event to trigger the QuantMERenderer
    let parent;
    for (let element of elementArray) {
        console.log(element);
        if (element.type === "bpmn:SubProcess") {
            element.parent = parent;
            this.addOverlay(element);
        }
    }

    // get the xml of the modeler and update the view
    //let updatedxml = await getXml(quantmeModeler);
    viewer.importXML(activeViewXml);
    overlays = viewer.get("overlays");

    // register the events and rendering
    new QuantMERenderer(viewer.get("eventBus"), viewer.get("styles"), viewer.get("bpmnRenderer"), viewer.get("textRenderer"), canvas);

    // get the currently active activities for the process instance
    let activeActivity = await getActiveActivities(camundaAPI, processInstanceId);
    console.log('Currently active activities to visualize: ', activeActivity);

    // visualize process token for retrieved active activities
    activeActivity.forEach(activeActivity =>
        visualizeActiveActivities(activeActivity['activityId'], overlays, quantmeElementRegistry, viewerElementRegistry, rootElement, processInstanceId, camundaAPI));
}

let rootElement = elementArray[0];
console.log('Creating overlay based on root element: ', rootElement)
for (let element of elementArray) {
    console.log(element);
    if (element.type === "bpmn:Task") {
        parent = element.parent;
        //bpmnReplace.replaceElement(quantmeElementRegistry.get(element.id), {
        //  type: "bpmn:Task",
        //});
    }
    if (element.type === "bpmn:DataObjectReference") {
        bpmnReplace.replaceElement(quantmeElementRegistry.get(element.id), {
            type: "bpmn:DataObjectReference",
        });
    }
}
// add overlay to remove existing elements from the diagram
console.log("View to generate overlay for is represented by the following XML: ", activeViewXml);
console.log(viewer.get("canvas"))
// get all tasks from the xml of the respective view and fire the replace event to trigger the QuantMERenderer
let parent;
for (let element of elementArray) {
    console.log(element);
    if (element.type === "bpmn:Task") {
        parent = element.parent;
        //bpmnReplace.replaceElement(quantmeElementRegistry.get(element.id), {
        //  type: "bpmn:Task",
        //});
    }
    if (element.type === "bpmn:DataObjectReference") {
        bpmnReplace.replaceElement(quantmeElementRegistry.get(element.id), {
            type: "bpmn:DataObjectReference",
        });
    }
}
for (let element of elementArray) {
    console.log(element);
    if (element.type === "bpmn:SubProcess") {
        element.parent = parent;
        //bpmnReplace.replaceElement(quantmeElementRegistry.get(element.id), {
        //  type: "bpmn:SubProcess",
        // });
        this.addOverlay(element);
    }
}

/**
* Get the currently active activities for the given process instance
* Get the variables from the process instance
*
* @param camundaAPI the Camunda APIs to access the backend
* @param processInstanceId the ID of the process instance to retrieve the active activity for
* @returns an array with currently active activities
* @returns an array with variables
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
 * Get the variables from the process instance
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
    return await res.json();
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

    console.log(viewerElementRegistry.get(activeActivityId));
    const selector = `.djs-overlay-container`;

    const selectedElement = document.querySelector(selector);
    console.log(selectedElement)
    let top = viewerElementRegistry.get(activeActivityId).y + viewerElementRegistry.get(activeActivityId).height + 11;
    let x = viewerElementRegistry.get(activeActivityId).x;


    if (selectedElement) {
        const overlayHtml = `
        <div class="djs-overlays" style="position: absolute;" data-container-id="${activeActivityId}">
        <div class="djs-overlay" data-overlay-id="ov-468528788-1" style="position: absolute; left: ${x}px; top: ${top}px; transform-origin: left top;"><div class="activity-bottom-left-position instances-overlay">
  <span class="badge instance-count" data-original-title="" title="">1</span>
  <span class="badge badge-important instance-incidents" style="display: none;"></span>
</div></div></div>
  `;

        // Append the overlay HTML to the selected element
        selectedElement.insertAdjacentHTML('beforeend', overlayHtml);
    }
    // find the entry point for the workflow part belonging to the hybrid program
    if (activeActivityAttributes['quantme:containedElements'] !== undefined) {
        console.log(activeActivityAttributes["quantme:containedElements"]);
        console.log(activeActivityId)

        //if(activeActivityAttributes["quantme:containedElements"].includes(activeActivityId)){

        //let entryPoint = entryPoints[0];
        // add overlay to the retrieved root element
        let entryPoint = quantmeElementRegistry.get(activeActivityId);
        console.log(entryPoint);
        overlays.add(rootElement, {
            position: { left: entryPoint.x - 10, top: entryPoint.y + entryPoint.height - 10 },
            html: '<span class="badge instance-count" data-original-title="" title="">1</span>'
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
