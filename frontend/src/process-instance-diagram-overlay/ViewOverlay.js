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

import BpmnModeler from 'bpmn-js/lib/Modeler';
import camundaModdlePackage from 'camunda-bpmn-moddle/resources/camunda';
import quantMEModdleExtension from './quantum4bpmn.json';
import quantMEModule from './quantme';

export async function renderOverlay(viewer, camundaAPI, processInstanceId) {
    console.log('Rendering view overlay using viewer: ', viewer)
    console.log('View corresponds to process instance ID: ', processInstanceId)

    // retrieve active view to apply variable filtering if required
    const cockpitApi = camundaAPI.cockpitApi;
    console.log('Camunda APIs to generate overlays: ', camundaAPI);
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
    let response = await res.json();
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
    let viewerRegistry = viewer.get("elementRegistry")
    console.log("Successfully prepared viewer to add overlay!");

    console.log("View to generate overlay for is represented by the following XML: ", activeViewXml);

    // create modeler capable of understanding the QuantME modeling constructs
    let quantmeModeler = await createQuantmeModelerFromXml(activeViewXml);
    console.log('Successfully created QuantME modeler to visualize QuantME constructs in process views: ', quantmeModeler);
    let quantmeElementRegistry = quantmeModeler.get('elementRegistry');

    // export view as Svg
    let viewSvg = await getSvg(quantmeModeler);
    viewSvg = updateViewBox(viewSvg, quantmeElementRegistry)
    console.log('Created Svg for process view: ', viewSvg);

    // get the flow element representing the whole BPMN plane
    let elementArray = viewerRegistry.getAll();
    console.log('Diagram contains the following elements: ', elementArray);
    elementArray = elementArray.filter(element => element.type === 'bpmn:Process');
    console.log('Found ' + elementArray.length + ' flow elements of type "bpmn:Process"!');
    if (elementArray.length === 0) {
        console.error('Unable to find element of type "bpmn:Process" to add overlay. Aborting!');
        return;
    }
    let rootElement = elementArray[0];
    console.log('Creating overlay based on root element: ', rootElement)

    // add overlay to the retrieved root element
    overlays.add(rootElement, 'process-view-overlay', {
        position: { left:0, top: 0 },
        html: viewSvg
    });


    // TODO: add overlay
    let properties = new Set();
    let currentObj = viewer;
    do {
        Object.getOwnPropertyNames(currentObj).map(item => properties.add(item));
    } while ((currentObj = Object.getPrototypeOf(currentObj)));
    console.log([...properties.keys()].filter(item => typeof viewer[item] === 'function'));
    properties = new Set();
    currentObj = quantmeElementRegistry;
    do {
        Object.getOwnPropertyNames(currentObj).map(item => properties.add(item));
    } while ((currentObj = Object.getPrototypeOf(currentObj)));
    console.log([...properties.keys()].filter(item => typeof quantmeElementRegistry[item] === 'function'));
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

    // TODO
    let width = 1000;
    let height = 1000;
    let x = 0;
    let y = 0;
    return svg.replace('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0" viewBox="0 0 0 0" version="1.1">',
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + width + '" height="' + height + '" viewBox="' + x + ' ' + y + ' ' + width + ' ' + height + '" version="1.1">');
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
            quantMEModule
        ],
        moddleExtensions: {
            camunda: camundaModdlePackage,
            quantME: quantMEModdleExtension
        }
    });
}
