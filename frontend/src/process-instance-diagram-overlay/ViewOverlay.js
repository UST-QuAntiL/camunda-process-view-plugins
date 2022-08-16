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

import './process-instance-diagram.scss'
import '../camunda.scss'

import BpmnModeler from 'bpmn-js/lib/Modeler';
import camundaModdlePackage from 'camunda-bpmn-moddle/resources/camunda';
import quantMEModdleExtension from './quantum4bpmn.json';
import quantMEModule from './quantme';

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
    activeActivity.forEach(activeActivity => visualizeActiveActivities(activeActivity['activityId'], overlays, quantmeElementRegistry, viewerElementRegistry, rootElement));
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
 */
function visualizeActiveActivities(activeActivityId, overlays, quantmeElementRegistry, viewerElementRegistry, rootElement) {
    console.log('Visualizing process token for active activity with ID: ', activeActivityId);

    // get activity from executed workflow related to given ID
    let activeActivity = viewerElementRegistry.get(activeActivityId).businessObject;
    console.log('Retrieved corresponding activity object: ', activeActivity);

    // retrieve attributes comprising relevant information about hybrid programs
    let activeActivityAttributes = activeActivity.$attrs;
    console.log('Found attributes: ', activeActivityAttributes);

    // handle activities related to hybrid program executions and regular activities differently
    if (activeActivityAttributes['quantme:hybridRuntimeExecution'] !== undefined && activeActivityAttributes['quantme:hybridRuntimeExecution'] === true) {
        console.log('Active activity belongs to hybrid program execution with ID: ', activeActivityAttributes['quantme:hybridProgramId']);

        // TODO
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
        width = result.maxX + 10;
        height = result.maxY + 10;
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
            quantMEModule
        ],
        moddleExtensions: {
            camunda: camundaModdlePackage,
            quantME: quantMEModdleExtension
        }
    });
}
