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
        <th>Scope</th>
    </tr>`;

    // retrieve active view to apply variable filtering if required
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
    const processVariablesEndpoint = `${cockpitApi}/process-instance/${processInstanceId}/variables`
    console.log("Retrieving variables from URL: ", processVariablesEndpoint)
    res = await fetch(processVariablesEndpoint,
        {method: 'GET', body: '{}',
            headers: {
                "Accept": "application/json",
                "X-XSRF-TOKEN": camundaAPI.CSRFToken,
            }});
    let variablesJson = await res.json();
    console.log("Retrieved result for current variables: ", variablesJson);

    const body = table.createTBody();

    const row = document.createElement("tr");
    const nameCol = document.createElement("td");
    const typeCol = document.createElement("td");
    const valueCol = document.createElement("td");
    const scopeCol = document.createElement("td");

    nameCol.innerText = 'TODO';
    typeCol.innerText = 'TODO';
    valueCol.innerText = 'TODO';
    scopeCol.innerText = 'TODO';

    row.appendChild(nameCol);
    row.appendChild(typeCol);
    row.appendChild(valueCol);
    row.appendChild(scopeCol);
    body.appendChild(row);

    // TODO: add rows

    node.innerHTML = "";
    node.appendChild(table);
}
