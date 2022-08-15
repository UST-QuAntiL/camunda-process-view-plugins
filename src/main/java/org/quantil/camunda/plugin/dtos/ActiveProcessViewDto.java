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

package org.quantil.camunda.plugin.dtos;

public class ActiveProcessViewDto {

    private String activeProcessView;

    private String activeProcessViewXml;

    public String getActiveProcessView() {
        return activeProcessView;
    }

    public void setActiveProcessView(String activeProcessView) {
        this.activeProcessView = activeProcessView;
    }

    public String getActiveProcessViewXml() {
        return activeProcessViewXml;
    }

    public void setActiveProcessViewXml(String activeProcessViewXml) {
        this.activeProcessViewXml = activeProcessViewXml;
    }
}
