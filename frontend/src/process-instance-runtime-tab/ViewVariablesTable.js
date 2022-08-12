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

        // create new row
        const row = document.createElement("tr");
        const nameCol = document.createElement("td");
        const typeCol = document.createElement("td");
        const valueCol = document.createElement("td");

        if (value['type'] === 'String') {
            nameCol.innerText = key;
            typeCol.innerText = value['type'];
            valueCol.innerText = value['value'];
        }

        // add retrieved variables to body
        row.appendChild(nameCol);
        row.appendChild(typeCol);
        row.appendChild(valueCol);
        body.appendChild(row);

        // TODO: handle different types of variables
        console.log(key, value);
    }

    node.innerHTML = "";
    node.appendChild(table);
}
