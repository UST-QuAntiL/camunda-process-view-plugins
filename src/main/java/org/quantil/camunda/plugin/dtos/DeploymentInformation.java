package org.quantil.camunda.plugin.dto;


import java.util.Date;
import java.util.List;

public class DeploymentInformation {
    public static class LogEntry {
        private Date timestamp;
        private String status;
        private String message;

        public LogEntry(Date timestamp, String status, String message) {
            this.timestamp = timestamp;
            this.status = status;
            this.message = message;
        }

        public Date getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(Date timestamp) {
            this.timestamp = timestamp;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    private String csarName;

    private String buildPlanState;

    private String instanceState;

    private Date instanceCreatedAt;

    private List<LogEntry> logs;

    public String getCsarName() {
        return csarName;
    }

    public void setCsarName(String csarName) {
        this.csarName = csarName;
    }

    public String getBuildPlanState() {
        return buildPlanState;
    }

    public void setBuildPlanState(String buildPlanState) {
        this.buildPlanState = buildPlanState;
    }

    public String getInstanceState() {
        return instanceState;
    }

    public void setInstanceState(String instanceState) {
        this.instanceState = instanceState;
    }

    public List<LogEntry> getLogs() {
        return logs;
    }

    public void setLogs(List<LogEntry> logs) {
        this.logs = logs;
    }

    public Date getInstanceCreatedAt() {
        return instanceCreatedAt;
    }

    public void setInstanceCreatedAt(Date instanceCreatedAt) {
        this.instanceCreatedAt = instanceCreatedAt;
    }
}
