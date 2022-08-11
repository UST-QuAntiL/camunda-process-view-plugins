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

import React, {useEffect, useState} from "react";

import "./process-view-button.scss"

function ProcessViewButton({camundaAPI, processInstanceId}) {
    const [activatedView, setActivatedView] = useState();

    const cockpitApi = camundaAPI.cockpitApi;
    const engine = camundaAPI.engine;
    const activeProcessViewEndpoint = `${cockpitApi}/plugin/camunda-process-views-plugin/${engine}/process-instance/${processInstanceId}`
    console.log('URL to server-side plugin: ', activeProcessViewEndpoint);

    // get the currently active view by retrieving the corresponding variable of the process instance
    useEffect(() => {
        fetch(
            activeProcessViewEndpoint,
            {
                headers: {
                    'Accept': 'application/json'
                }
            }
        ).then(async res => {

            // retrieve value from response
            let response = await res.json();
            setActivatedView(response['activeProcessView']);
            console.log('Currently activated view: ', response['activeProcessView'])
        }).catch(err => {
            console.error(err);
        });
    }, []);

    function openDialog(activatedView){
            console.log('Opening dialog with currently activated view: ', activatedView);
    }

    return (
        <button className="btn btn-default btn-toolbar ng-scope" title="Change Process View to Visualize" onClick={() => openDialog(activatedView)} tooltip-placement="left">
            <img src="./process-view-button.png" />
        </button>
    );
}

export default ProcessViewButton;
