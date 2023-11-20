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
