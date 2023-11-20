package org.quantil.camunda.plugin;

import org.camunda.bpm.cockpit.plugin.spi.impl.AbstractCockpitPlugin;
import org.quantil.camunda.plugin.resources.OpenToscaRootResource;

import java.util.HashSet;
import java.util.Set;


/**
 * Main class of the server-side plugin
 */
public class OpenToscaPlugin extends AbstractCockpitPlugin {

    public static final String ID = "camunda-deployment-view-plugin";

    public String getId() {
        return ID;
    }

    @Override
    public Set<Class<?>> getResourceClasses() {
        HashSet<Class<?>> classes = new HashSet<>();
        classes.add(OpenToscaRootResource.class);
        return classes;
    }
}