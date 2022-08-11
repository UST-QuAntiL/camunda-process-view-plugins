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

package org.quantil.camunda.plugin;

import java.util.List;

import org.camunda.bpm.cockpit.Cockpit;
import org.camunda.bpm.cockpit.db.QueryParameters;
import org.camunda.bpm.cockpit.db.QueryService;
import org.camunda.bpm.cockpit.plugin.spi.CockpitPlugin;
import org.camunda.bpm.cockpit.plugin.test.AbstractCockpitPluginTest;
import org.junit.Assert;
import org.junit.Test;
import org.quantil.camunda.plugin.db.ProcessInstanceCountDto;

public class ProcessViewPluginTest extends AbstractCockpitPluginTest {

    @Test
    public void testPluginDiscovery() {
        CockpitPlugin samplePlugin = Cockpit.getRuntimeDelegate().getPluginRegistry().getPlugin("camunda-process-views-plugin");

        Assert.assertNotNull(samplePlugin);
    }

    @Test
    public void testSampleQueryWorks() {

        QueryService queryService = getQueryService();

        List<ProcessInstanceCountDto> instanceCounts =
                queryService
                        .executeQuery(
                                "cockpit.sample.selectProcessInstanceCountsByProcessDefinition",
                                new QueryParameters());

        Assert.assertEquals(0, instanceCounts.size());
    }
}
