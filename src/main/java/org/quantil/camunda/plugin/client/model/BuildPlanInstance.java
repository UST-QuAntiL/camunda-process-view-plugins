package org.quantil.camunda.plugin.client.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.quantil.camunda.plugin.client.model.LogEntry;
import org.quantil.camunda.plugin.client.model.Resource;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class BuildPlanInstance extends Resource {
    private String state;

    private List<LogEntry> logs;

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public List<LogEntry> getLogs() {
        return logs;
    }

    public void setLogs(List<LogEntry> logs) {
        this.logs = logs;
    }
}
