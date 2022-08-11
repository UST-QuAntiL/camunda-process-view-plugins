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

package org.quantil.camunda.plugin.services;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Service handling all functionality related to retrieving or changing views for process instances
 */
public class ProcessViewService {

    private static final String ENGINE_REST_SUFFIX = "engine-rest";

    /**
     * Find the name of the initial view, i.e., the workflow that is actually executed
     *
     * @param engineName the name of the engine to access variables and deployments
     * @param processInstanceId the process instance ID of the instance to get the intial process view for
     * @param URL the URL to access the Camunda REST API
     * @return the name of the initial process view
     */
    public String findInitialViewName(String engineName, String processInstanceId, String URL) throws IOException {
        System.out.println("Searching for initial process view name for process instance with ID: " + processInstanceId);

        // retrieve the ID of the deployment the given process instance belongs to
        String deploymentId = getDeploymentIdForProcessInstanceId(URL, processInstanceId);
        System.out.println("Process instance belongs to deployment with ID: " + deploymentId);

        // TODO
        return "original-workflow";
    }

    /**
     * Returns the name of the next view that is available for the given process instance
     *
     * @param engineName the name of the engine to access variables and deployments
     * @param processInstanceId the process instance ID of the instance to get the next process view for
     * @param activeView the currently active view
     * @param URL the URL to access the Camunda REST API
     * @return the name of the next view that should be activated
     */
    public String getNextProcessView(String engineName, String processInstanceId, String activeView, String URL) {
        System.out.println("Retrieving next process view name for process instance with ID: " + processInstanceId);

        // TODO
        return "original-workflow";
    }

    /**
     * Get the ID of the deployment the given process instance belongs to
     *
     * @param URL the URL to access the Camunda REST API
     * @param processInstanceId the process instance ID of the instance to get the ID of the deployment for
     * @return the ID of the deployment
     */
    private String getDeploymentIdForProcessInstanceId(String URL, String processInstanceId) throws IOException {
        String processInstanceUrl = URL + "/" + ENGINE_REST_SUFFIX + "/process-instance/" + processInstanceId;
        System.out.println("Retrieving process instance details from URL: " + processInstanceUrl);

        // request process instance details to get corresponding process definition ID
        java.net.URL url = new URL(processInstanceUrl);
        HttpURLConnection http = (HttpURLConnection) url.openConnection();
        http.setRequestProperty("Accept", "application/json");

        // extract definition ID from response object
        JsonNode processInstanceNode = new ObjectMapper().readTree(http.getInputStream());
        http.disconnect();
        String definitionId = processInstanceNode.get("definitionId").asText();
        System.out.println("Retrieved corresponding definition ID: " + definitionId);

        // use process definitions endpoint to retrieve deployment ID
        String processDefinitionsUrl = URL + "/" + ENGINE_REST_SUFFIX + "/process-definition/" + definitionId;
        System.out.println("Retrieving process definition details from URL: " + processDefinitionsUrl);
        url = new URL(processDefinitionsUrl);
        http = (HttpURLConnection) url.openConnection();
        http.setRequestProperty("Accept", "application/json");

        // extract deployment ID from response object
        JsonNode processDefinitionNode = new ObjectMapper().readTree(http.getInputStream());
        http.disconnect();
        System.out.println(processDefinitionNode.toPrettyString());
        String deploymentId = processDefinitionNode.get("deploymentId").asText();
        System.out.println("Retrieving deployment ID: " + deploymentId);

        return deploymentId;
    }
}
