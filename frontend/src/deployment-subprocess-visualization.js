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
    new OpenTOSCARenderer(viewer.get("eventBus"), viewer.get("styles"), viewer.get("bpmnRenderer"), viewer.get("textRenderer"), canvas);
    let eventBus = viewer.get("eventBus");

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
        canvas.getRootElement().children.forEach(findSubprocesses)
        for (const subProcess of subProcesses) {
            const newType = showSubProcesses ? "bpmn:SubProcess" : "bpmn:ServiceTask";
            console.log(showSubProcesses)
            let elementRegistry = viewer.get("elementRegistry");
            let context = {};
            context.element = subProcess;
            context.gfx = elementRegistry.getGraphics(subProcess);
            context.show = showSubProcesses;
            console.log("fire");
            console.log(showSubProcesses);
            eventBus.fire("render.shape", context)

            // only change shape if it is a valid deployment model and onDemand
            if (subProcess.type !== newType //&& !subProcess.businessObject.get('opentosca:deploymentModelUrl').includes("wineryEndpoint")
            ) {
                //eventBus.fire("render.shape", context)
                // trigger the render shape event
                if (subProcess.businessObject.get('opentosca:onDemandDeployment') === "true") {
                    canvas.removeShape(subProcess);
                    subProcess.type = newType;
                    canvas.addShape(subProcess);
                } else {
                    //if (showSubProcesses) {
                        console.log("removeShape");
                        
                       
                        //eventBus.fire("render.shape", context)
                        //canvas.removeShape(subProcess);
                        //canvas.addShape(subProcess);
                    //}
                }

                if (showSubProcesses) {
                    drilldownOverlayBehavior.addOverlay(subProcess);
                }
            }
        }
    }
    update(showSubProcesses);
    actionButtonElement.addEventListener("click", () => {
        showSubProcesses = !showSubProcesses;
        console.log(showSubProcesses)
        showTasks = !showTasks;
        update(showSubProcesses);
    })
    control.addAction({ html: actionButtonElement })
}