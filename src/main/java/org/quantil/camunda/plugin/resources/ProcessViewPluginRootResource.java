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

package org.quantil.camunda.plugin.resources;

import java.util.Objects;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import org.camunda.bpm.cockpit.plugin.resource.AbstractPluginRootResource;
import org.camunda.bpm.engine.ProcessEngine;
import org.camunda.bpm.engine.ProcessEngines;
import org.camunda.bpm.engine.RuntimeService;
import org.quantil.camunda.plugin.ProcessViewPlugin;
import org.quantil.camunda.plugin.dtos.ActiveProcessViewDto;

/**
 * Root control for the API of the server-side plugin
 */
@Path("plugin/" + ProcessViewPlugin.ID)
public class ProcessViewPluginRootResource extends AbstractPluginRootResource {

  public ProcessViewPluginRootResource() {
    super(ProcessViewPlugin.ID);
  }

  @GET
  @Path("{engineName}/process-instance/{processInstanceId}")
  public ActiveProcessViewDto getCurrentlyActiveProcessView(@PathParam("engineName") String engineName,
                                                            @PathParam("processInstanceId") String processInstanceId) {

    // get runtime service to access variables of process instances
    ProcessEngine processEngine = ProcessEngines.getProcessEngine(engineName);
    RuntimeService runtimeService = processEngine.getRuntimeService();

    // get variable storing the active process view
    Object activeProcessViewVariable = runtimeService.getVariable(processInstanceId, "process-view-extension-active-view");
    String activeProcessView;
    if (Objects.isNull(activeProcessViewVariable)){

      // set original workflow as initial view if not yet set
      System.out.println("Adding default value as active process view is currently not set!");
      runtimeService.setVariable(processInstanceId, "process-view-extension-active-view", "original-workflow");
      activeProcessView = "original-workflow";
    } else{
      activeProcessView = activeProcessViewVariable.toString();
    }

    // return active process view
    ActiveProcessViewDto dto = new ActiveProcessViewDto();
    dto.setActiveProcessView(activeProcessView);
    return dto;
  }
}
