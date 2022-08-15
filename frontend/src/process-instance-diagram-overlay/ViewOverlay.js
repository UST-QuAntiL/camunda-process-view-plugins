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
    console.log("Active view to visualize process view overlay for: ", activeView);

    // do not add overlays if executed workflow equals current view
    if (!activeView.includes('view-before-rewriting')) {
        console.log("Current view equals executed workflow. No overlay required!");
        return;
    }

    // clear viewer to add complete view as overlay
    console.log('Clearing viewer to add overlay to empty plane...');
    viewer.clear();

    // get overlays to attach new elements to
    let overlays = viewer.get("overlays")

    // get element registry to access elements of the diagram
    let elementRegistry = viewer.get('elementRegistry');
    console.log("Successfully prepared viewer to add overlay!");

    elementRegistry.forEach(function(flowElement) {
        overlays.add(flowElement, 'emoji', {
            position: { left:0, top: 0 },
            html: '<span style="font-size:40px">😁</span>'
        });
    });

    // TODO: add overlay
    let properties = new Set();
    let currentObj = viewer;
    do {
        Object.getOwnPropertyNames(currentObj).map(item => properties.add(item));
    } while ((currentObj = Object.getPrototypeOf(currentObj)));
    console.log([...properties.keys()].filter(item => typeof viewer[item] === 'function'));
    properties = new Set();
    currentObj = elementRegistry;
    do {
        Object.getOwnPropertyNames(currentObj).map(item => properties.add(item));
    } while ((currentObj = Object.getPrototypeOf(currentObj)));
    console.log([...properties.keys()].filter(item => typeof elementRegistry[item] === 'function'));
}
