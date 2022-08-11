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
        )
            .then(async res => {

                // retrieve value from response
                let response = await res.json();
                console.log(response)
                setActivatedView(response);
                console.log('Currently activated view: ', activatedView)
            })
            .catch(err => {
                console.error(err);
            });
    }, []);


    return (
        <>
            <div>Hello World!</div>
        </>
    );
}

export default ProcessViewButton;
