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

import "../camunda.scss"

export async function renderTable(camundaAPI, processInstanceId, node) {

    // create headers for the table
    const table = document.createElement("table");
    table.className = "cam-table";
    table.createTHead().innerHTML = `
    <tr>
        <th>Name</th>
        <th>Type</th>
        <th>Value</th>
    </tr>`;

    // retrieve active view to apply variable filtering if required
    const engineApi = camundaAPI.engineApi;
    const cockpitApi = camundaAPI.cockpitApi;
    const engine = camundaAPI.engine;
    const processViewEndpoint = `${cockpitApi}/plugin/camunda-process-views-plugin/${engine}/process-instance/${processInstanceId}/active-view`;
    console.log('Retrieving currently active view using URL: ', processViewEndpoint);
    let res = await fetch(processViewEndpoint,
        {
            headers: {
                'Accept': 'application/json'
            }
        }
    )
    let response = await res.json();
    let activeView = response['activeProcessView'];
    console.log("Active view to visualize variables for: ", activeView);

    // get all variables for the current process instance
    const processVariablesEndpoint = `${engineApi}/process-instance/${processInstanceId}/variables`
    console.log("Retrieving variables from URL: ", processVariablesEndpoint)
    res = await fetch(processVariablesEndpoint,
        {method: 'GET',
            headers: {
                "Accept": "application/json",
                "X-XSRF-TOKEN": camundaAPI.CSRFToken,
            }});
    let variablesJson = await res.json();
    console.log("Retrieved result for current variables: ", variablesJson);

    // create body containing the variables
    const body = table.createTBody();

    // iterate through variables and add them to the table
    for (const [key, value] of Object.entries(variablesJson)) {
        console.log("Found variable with name: ", key)

        // do not visualize variable storing currently active view
        if (key === "process-view-extension-active-view") {
            continue;
        }

        // skip variables related to hybrid jobs if not within corresponding view
        if (!activeView.includes('view-before-rewriting') && key.startsWith('hybridJob-')) {
            console.log('Skipping variable ' + key + ' as active view does not visualize data about hybrid Runtimes: ' + activeView);
            continue;
        }

        // create new row
        const row = document.createElement("tr");
        const nameCol = document.createElement("td");
        const typeCol = document.createElement("td");
        const valueCol = document.createElement("td");

        // handle variable types for which values can be directly accessed
        if (value['type'] === 'Boolean' || value['type'] === 'Short' || value['type'] === 'Integer'
            || value['type'] === 'Long' || value['type'] === 'Double' || value['type'] === 'String') {
            nameCol.innerText = key;
            typeCol.innerText = value['type'];
            valueCol.innerText = value['value'];
        } else if (value['type'] === 'File') {
            // handle file variables
            console.log("Handle file variable: ", key)
            nameCol.innerText = key;
            typeCol.innerText = 'File';

            // handle link to file
            let anchor = document.createElement('a');
            let textNode = document.createTextNode("Download");
            anchor.appendChild(textNode);
            anchor.href = processVariablesEndpoint + '/' + key + '/data';
            valueCol.appendChild(anchor);
        } else{
            // other kinds of variables are not supported
            continue;
        }

        // add retrieved variables to body
        row.appendChild(nameCol);
        row.appendChild(typeCol);
        row.appendChild(valueCol);
        body.appendChild(row);
    }

    node.innerHTML = "";
    node.appendChild(table);
}
