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

package org.quantil.camunda.plugin.services;

/**
 * Service handling all functionality related to retrieving or changing views for process instances
 */
public class ProcessViewService {

    /**
     * Returns the name of the next view that is available for the given process instance
     *
     * @param engineName the name of the engine to access variables and deployments
     * @param processInstanceId the process instance ID of the instance to get the next process view for
     * @param activeView the currently active view
     * @return the name of the next view that should be activated
     */
    public String getNextProcessView(String engineName, String processInstanceId, String activeView) {

        // TODO
        return "original-workflow";
    }
}
