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

package org.quantil.camunda.plugin.resources;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import org.camunda.bpm.cockpit.plugin.resource.AbstractCockpitPluginRootResource;
import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.ProcessEngines;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.camunda.bpm.model.bpmn.instance.ServiceTask;
import org.camunda.bpm.model.bpmn.instance.SubProcess;
import org.camunda.bpm.model.xml.ModelInstance;
import org.camunda.bpm.model.xml.instance.ModelElementInstance;
import org.quantil.camunda.plugin.OpenToscaPlugin;
import org.quantil.camunda.plugin.client.OpenToscaClient;
import org.quantil.camunda.plugin.client.model.BuildPlanInstance;
import org.quantil.camunda.plugin.client.model.Resource;
import org.quantil.camunda.plugin.client.model.ServiceTemplateInstance;
import org.quantil.camunda.plugin.dto.DeploymentInformation;

import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Path("plugin/" + OpenToscaPlugin.ID)
public class OpenToscaRootResource extends AbstractCockpitPluginRootResource {

    private OpenToscaClient openToscaClient;

    private static final String OPENTOSCA_NS = "https://github.com/UST-QuAntiL/OpenTOSCA";

    public OpenToscaRootResource() {
        super(OpenToscaPlugin.ID);
    }

    @GET
    @Path("{engineName}/process-instance/{processInstanceId}/deployment-info")
    public List<DeploymentInformation> getDeploymentInformation(@PathParam("engineName") String engineName,
                                                                @PathParam("processInstanceId") String processInstanceId) {
        ProcessEngine processEngine = ProcessEngines.getProcessEngine(engineName);
        RuntimeService runtimeService = processEngine.getRuntimeService();
        ProcessInstance processInstance = runtimeService.createProcessInstanceQuery().processInstanceId(processInstanceId).singleResult();
        ModelInstance modelInstance = processEngine.getRepositoryService().getBpmnModelInstance(processInstance.getProcessDefinitionId());

        return Stream.concat(
                        modelInstance.getModelElementsByType(ServiceTask.class).stream()
                                .filter(serviceTask -> {
                                    ModelElementInstance parentElement = serviceTask.getParentElement();
                                    // Ignore on demand deployment
                                    return !(parentElement instanceof SubProcess) || !"true".equals(parentElement.getAttributeValueNs(OPENTOSCA_NS, "onDemandDeployment"));
                                }).map(serviceTask -> {
                                    String deploymentModelUrl = serviceTask.getAttributeValueNs(OPENTOSCA_NS, "deploymentModelUrl");
                                    String deploymentBuildPlanInstanceUrl = serviceTask.getAttributeValueNs(OPENTOSCA_NS, "deploymentBuildPlanInstanceUrl");
                                    if (deploymentModelUrl == null || deploymentBuildPlanInstanceUrl == null) return null;
                                    return fetchDeploymentInformation(deploymentModelUrl, deploymentBuildPlanInstanceUrl);
                                }),
                        modelInstance.getModelElementsByType(SubProcess.class).stream()
                                .filter(subProcess -> "true".equals(subProcess.getAttributeValueNs(OPENTOSCA_NS, "onDemandDeployment")))
                                .map(subProcess -> {
                                    String deploymentModelUrl = subProcess.getAttributeValueNs(OPENTOSCA_NS, "deploymentModelUrl");
                                    String id = subProcess.getId();
                                    String deploymentBuildPlanInstanceUrl = (String) runtimeService.getVariableLocal(processInstanceId, id + "_deploymentBuildPlanInstanceUrl");
                                    if (deploymentBuildPlanInstanceUrl == null)
                                        deploymentBuildPlanInstanceUrl = subProcess.getAttributeValueNs(OPENTOSCA_NS, "deploymentBuildPlanInstanceUrl");

                                    return fetchDeploymentInformation(deploymentModelUrl, deploymentBuildPlanInstanceUrl);
                                }))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

    }

    private DeploymentInformation fetchDeploymentInformation(String deploymentModelUrl, String deploymentBuildPlanInstanceUrl) {
        try {
            String csarName = extractCsarNameFromDeploymentModelUrl(deploymentModelUrl);
            DeploymentInformation deploymentInformation = new DeploymentInformation();
            deploymentInformation.setCsarName(csarName);
            if (deploymentBuildPlanInstanceUrl == null) {
                deploymentInformation.setBuildPlanState("UNAVAILABLE");
                deploymentInformation.setInstanceState("UNAVAILABLE");
                deploymentInformation.setLogs(Collections.emptyList());
            } else {
                BuildPlanInstance buildPlanInstance = getOpenToscaClient().fetch(deploymentBuildPlanInstanceUrl, BuildPlanInstance.class);

                deploymentInformation.setBuildPlanState(buildPlanInstance.getState());
                deploymentInformation.setLogs(buildPlanInstance.getLogs().stream()
                        .map(logEntry -> new DeploymentInformation.LogEntry(new Date(logEntry.getStartTimestamp()), logEntry.getStatus(), logEntry.getMessage()))
                        .collect(Collectors.toList()));
                Resource.Link instanceLink = buildPlanInstance.getLinks().get("service_template_instance");
                if (instanceLink != null) {
                    ServiceTemplateInstance serviceTemplateInstance = getOpenToscaClient().fetch(instanceLink.getHref(), ServiceTemplateInstance.class);
                    deploymentInformation.setInstanceState(serviceTemplateInstance.getState());
                    deploymentInformation.setInstanceCreatedAt(new Date(serviceTemplateInstance.getCreatedAt()));
                }
            }
            return deploymentInformation;
        } catch (Exception e) {
            System.err.println("Could not retrieve deployment information for " + deploymentModelUrl);
            e.printStackTrace();
            return null;
        }
    }

    private OpenToscaClient getOpenToscaClient() {
        if (openToscaClient == null) {
            openToscaClient = new OpenToscaClient();
        }
        return openToscaClient;
    }

    void setOpenToscaClient(OpenToscaClient openToscaClient) {
        this.openToscaClient = openToscaClient;
    }

    static String extractCsarNameFromDeploymentModelUrl(String deploymentModelUrl) {
        String[] deploymentModelUrlParts = deploymentModelUrl.split("/");
        if (deploymentModelUrlParts.length < 5) {
            throw new IllegalArgumentException("Not a deployment model url");
        }
        return deploymentModelUrlParts[deploymentModelUrlParts.length - 2];
    }
}
