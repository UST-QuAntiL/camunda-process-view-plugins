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

    // add overlay to remove existing elements from the diagram
    overlays.add(rootElement, 'background-overlay', {
        position: {left: 0, top: 0},
        html: '<div class="background-div"></div>'
    });

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
    for(let element of elementArray){
        console.log(element);
        if(element.type === "bpmn:Task"){
            bpmnReplace.replaceElement(quantmeElementRegistry.get(element.id), {
                type: "bpmn:Task",
              });
        }
        if(element.type === "bpmn:DataObjectReference"){
            bpmnReplace.replaceElement(quantmeElementRegistry.get(element.id), {
                type: "bpmn:DataObjectReference",
              });
        }
    }

    // get the xml of the modeler and update the view
    //let updatedxml = await getXml(quantmeModeler);
    viewer.importXML(activeViewXml);

    // register the events and rendering
    new QuantMERenderer(viewer.get("eventBus"), viewer.get("styles"), viewer.get("bpmnRenderer"), viewer.get("textRenderer"), canvas);
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
