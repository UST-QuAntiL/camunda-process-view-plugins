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

package org.quantil.camunda.plugin.client;

import jakarta.ws.rs.client.Client;
import jakarta.ws.rs.client.ClientBuilder;
import jakarta.ws.rs.core.MediaType;
import org.quantil.camunda.plugin.client.model.BuildPlanInstances;

import java.util.List;

public class OpenToscaClient implements AutoCloseable {

    private final Client client;

    public OpenToscaClient() {
        client = ClientBuilder.newClient();
    }

    public <T> T fetch(String url, Class<T> clazz) {
        return client.target(url)
                .request(MediaType.APPLICATION_JSON_TYPE)
                .get(clazz);
    }

    @Override
    public void close() throws Exception {
        client.close();
    }
}
