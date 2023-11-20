package org.quantil.camunda.plugin.client.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Map;

public class Resource {

    public static class Link {
        private String href;

        public String getHref() {
            return href;
        }

        public void setHref(String href) {
            this.href = href;
        }
    }

    @JsonProperty("_links")
    private Map<String, Link> links;

    public Map<String, Link> getLinks() {
        return links;
    }

    public void setLinks(Map<String, Link> links) {
        this.links = links;
    }
}
