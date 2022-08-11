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
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

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

        // retrieve resources for deployment
        List<String> resources = getResourcesForDeployment(URL, deploymentId);
        System.out.println("Retrieved list with " + deploymentId + " resources for the deployment!");

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

    /**
     * Retrieve the names of all resources contained in the given deployment
     *
     * @param URL the URL to access the Camunda REST API
     * @param deploymentId the ID of the deployment to retrieve the resources for
     * @return the list with names of contained resources
     */
    private List<String> getResourcesForDeployment(String URL, String deploymentId) throws IOException {
        List<String> resourcesList = new ArrayList();

        // create URL to deployment endpoint
        String deploymentUrl = URL + "/" + ENGINE_REST_SUFFIX + "/deployment/" + deploymentId + "/resources";
        System.out.println("Retrieving resources for deployment from URL: " + deploymentUrl);

        // request all resources for the given deployment
        java.net.URL url = new URL(deploymentUrl);
        HttpURLConnection http = (HttpURLConnection) url.openConnection();
        http.setRequestProperty("Accept", "application/json");

        // extract resources from response object
        JsonNode deploymentNode = new ObjectMapper().readTree(http.getInputStream());
        http.disconnect();

        // TODO: parse to list with resources
        System.out.println(deploymentNode.toPrettyString());

        return resourcesList;
    }
}
