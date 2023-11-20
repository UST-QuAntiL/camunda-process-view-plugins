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

package org.quantil.camunda.plugin.client.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;


public class BuildPlanInstances extends Resource {
    @JsonProperty("plan_instances")
    private List<BuildPlanInstance> planInstances;

    public List<BuildPlanInstance> getPlanInstances() {
        return planInstances;
    }

    public void setPlanInstances(List<BuildPlanInstance> planInstances) {
        this.planInstances = planInstances;
    }
}
