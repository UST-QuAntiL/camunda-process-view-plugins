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

import OpenTOSCARenderer from "./process-instance-diagram-overlay/opentosca/OpenTOSCARenderer";

export function addSubprocessToggleButton(viewer, options, { control }) {
    const canvas = viewer.get("canvas");
    const actionButtonElement = document.createElement("button");
    actionButtonElement.id = "deploymentButton";
    actionButtonElement.style.display = "none";
    let showSubProcesses = false;
    let showTasks = false;
    const drilldownOverlayBehavior = viewer.get("drilldownOverlayBehavior");

    console.log(canvas);
    

    const update = (showSubProcesses) => {
        const subProcesses = [];
        const tasks = [];
        const findSubprocesses = (element) => {
            if (element.businessObject.get('opentosca:deploymentModelUrl')) {
                subProcesses.push(element);
            }
            if (element.type === "bpmn:SubProcess") {
                if (!element.collapsed) {
                    element.children.forEach(findSubprocesses);
                }
            }
        }
        const findTasks = (element) => {
            console.log(element)
            if (element.businessObject.get('quantmeTaskType')) {
                tasks.push(element);
            }
        }
        canvas.getRootElement().children.forEach(findSubprocesses)
        for (const subProcess of subProcesses) {
            const newType = showSubProcesses ? "bpmn:SubProcess" : "bpmn:ServiceTask"
            if (subProcess.type !== newType) {
                canvas.removeShape(subProcess);
                subProcess.type = newType;
                canvas.addShape(subProcess);
                if (showSubProcesses) {
                    console.log("make overlay")
                    drilldownOverlayBehavior.addOverlay(subProcess);
                }
            }
        }

        canvas.getRootElement().children.forEach(findTasks)
        for (const task of tasks) {
            const newType = showTasks ? "bpmn:Task" : "bpmn:Task"
            if (task.type !== newType) {
                canvas.removeShape(task);
                task.type = newType;
                canvas.addShape(task);
                //if (showSubProcesses) {
                  //  console.log("make overlay")
                   // drilldownOverlayBehavior.addOverlay(subProcess);
                //}
            }
        }
    }
    update(showSubProcesses);
    actionButtonElement.addEventListener("click", () => {
        new OpenTOSCARenderer(viewer.get("eventBus"), viewer.get("styles"), viewer.get("bpmnRenderer"), viewer.get("textRenderer"), canvas);
        showSubProcesses = !showSubProcesses;
        showTasks = !showTasks;
        update(showSubProcesses);
    })
    control.addAction({ html: actionButtonElement })
}