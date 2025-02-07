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

import java.io.IOException;
import java.util.Objects;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.UriInfo;

import org.apache.ibatis.javassist.NotFoundException;
import org.camunda.bpm.cockpit.plugin.resource.AbstractPluginRootResource;
import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.ProcessEngines;
import org.camunda.bpm.engine.RuntimeService;
import org.quantil.camunda.plugin.ProcessViewPlugin;
import org.quantil.camunda.plugin.dtos.ActiveProcessViewDto;
import org.quantil.camunda.plugin.services.ProcessViewService;

/**
 * Root control for the API of the server-side plugin
 */
@Path("plugin/" + ProcessViewPlugin.ID)
public class ProcessViewPluginRootResource extends AbstractPluginRootResource {

  public ProcessViewPluginRootResource() {
    super(ProcessViewPlugin.ID);
  }

  @GET
  @Path("{engineName}/process-instance/{processInstanceId}/active-view")
  public ActiveProcessViewDto getCurrentlyActiveProcessView(@Context UriInfo uriInfo,
      @PathParam("engineName") String engineName,
      @PathParam("processInstanceId") String processInstanceId)
      throws IOException, NotFoundException {
    // workaround to access the Camunda REST API, as the Java API does not provide
    // all required details
    String baseUrl = "http://" + uriInfo.getAbsolutePath().getHost() + ":" + uriInfo.getAbsolutePath().getPort();
    System.out.println("Received request for host and port: " + baseUrl);

    // get runtime service to access variables of process instances
    ProcessEngine processEngine = ProcessEngines.getProcessEngine(engineName);
    RuntimeService runtimeService = processEngine.getRuntimeService();

    // get variable storing the active process view
    ProcessViewService processViewService = new ProcessViewService();
    Object activeProcessViewVariable = runtimeService.getVariable(processInstanceId,
        "process-view-extension-active-view");
    String activeProcessView;
    if (Objects.isNull(activeProcessViewVariable)) {
      System.out.println("Adding default value as active process view is currently not set!");

      // set original workflow as initial view if not yet set
      activeProcessView = processViewService.findInitialViewName(processInstanceId, baseUrl);
      runtimeService.setVariable(processInstanceId, "process-view-extension-active-view", activeProcessView);
    } else {
      activeProcessView = activeProcessViewVariable.toString();
    }

    // get XML representing the given view
    String processViewXml = processViewService.getProcessViewXml(processInstanceId, activeProcessView, baseUrl);

    // return active process view
    ActiveProcessViewDto dto = new ActiveProcessViewDto();
    dto.setActiveProcessView(activeProcessView);
    dto.setActiveProcessViewXml(processViewXml);
    return dto;
  }

  @POST
  @Path("{engineName}/process-instance/{processInstanceId}/change-view")
  public Response switchToNextProcessView(@Context UriInfo uriInfo, @PathParam("engineName") String engineName,
      @PathParam("processInstanceId") String processInstanceId) throws IOException {
    // workaround to access the Camunda REST API, as the Java API does not provide
    // all required details
    String baseUrl = "http://" + uriInfo.getAbsolutePath().getHost() + ":" + uriInfo.getAbsolutePath().getPort();
    System.out.println("Received request for host and port: " + baseUrl);

    // get runtime service to access variables of process instances
    ProcessEngine processEngine = ProcessEngines.getProcessEngine(engineName);
    RuntimeService runtimeService = processEngine.getRuntimeService();

    // get variable storing the active process view
    Object activeProcessViewVariable = runtimeService.getVariable(processInstanceId,
        "process-view-extension-active-view");
    if (Objects.isNull(activeProcessViewVariable)) {
      return Response.status(404).build();
    }

    String activeProcessView = activeProcessViewVariable.toString();

    // get name of next view
    ProcessViewService processViewService = new ProcessViewService();
    String newProcessView = processViewService.getNextProcessView(processInstanceId, activeProcessView, baseUrl);
    runtimeService.setVariable(processInstanceId, "process-view-extension-active-view", newProcessView);
    System.out.println("New active process view has name: " + newProcessView);
    return Response.ok().build();
  }

  @POST
  @Path("{engineName}/process-instance/{processInstanceId}/view/{viewName}")
  public Response getSpecifiedProcessView(@Context UriInfo uriInfo, @PathParam("engineName") String engineName,
      @PathParam("processInstanceId") String processInstanceId, @PathParam("viewName") String viewName)
      throws IOException {

    // workaround to access the Camunda REST API, as the Java API does not provide
    // all required details
    String baseUrl = "http://" + uriInfo.getAbsolutePath().getHost() + ":" + uriInfo.getAbsolutePath().getPort();
    System.out.println("Received request for host and port for specific view: " + baseUrl);

    // get runtime service to access variables of process instances
    ProcessEngine processEngine = ProcessEngines.getProcessEngine(engineName);
    RuntimeService runtimeService = processEngine.getRuntimeService();

    // get variable storing the active process view
    ProcessViewService processViewService = new ProcessViewService();
    Object activeProcessViewVariable = runtimeService.getVariable(processInstanceId,
        "process-view-extension-active-view");
    String activeProcessView;
    if (Objects.isNull(activeProcessViewVariable)) {
      System.out.println("Adding default value as active process view is currently not set!");

      // set original workflow as initial view if not yet set
      activeProcessView = processViewService.findInitialViewName(processInstanceId, baseUrl);
      runtimeService.setVariable(processInstanceId, "process-view-extension-active-view", activeProcessView);
    } else {
      activeProcessView = activeProcessViewVariable.toString();
    }
    String newProcessView = processViewService.getProcessView(processInstanceId, activeProcessView, viewName, baseUrl);
    runtimeService.setVariable(processInstanceId, "process-view-extension-active-view", newProcessView);
    System.out.println("New active process view has name: " + newProcessView);
    return Response.ok().build();
  }

  @POST
  @Path("{engineName}/process-instance/{processInstanceId}/change-view/{viewId}")
  public Response switchToProcessView(@Context UriInfo uriInfo, @PathParam("engineName") String engineName,
      @PathParam("processInstanceId") String processInstanceId,
      @PathParam("viewId") String viewId) throws IOException {

    // workaround to access the Camunda REST API, as the Java API does not provide
    // all required details
    String baseUrl = "http://" + uriInfo.getAbsolutePath().getHost() + ":" + uriInfo.getAbsolutePath().getPort();
    System.out.println("Received request for host and port: " + baseUrl);

    // get runtime service to access variables of process instances
    ProcessEngine processEngine = ProcessEngines.getProcessEngine(engineName);
    RuntimeService runtimeService = processEngine.getRuntimeService();

    // get variable storing the active process view
    Object activeProcessViewVariable = runtimeService.getVariable(processInstanceId,
        "process-view-extension-active-view");
    if (Objects.isNull(activeProcessViewVariable)) {
      return Response.status(404).build();
    }
    String activeProcessView = activeProcessViewVariable.toString();

    ProcessViewService processViewService = new ProcessViewService();
    runtimeService.setVariable(processInstanceId, "process-view-extension-active-view", viewId);
    return Response.ok().build();
  }
}
