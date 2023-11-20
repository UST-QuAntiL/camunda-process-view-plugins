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
