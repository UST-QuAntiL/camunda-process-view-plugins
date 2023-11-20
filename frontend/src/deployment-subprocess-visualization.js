import OpenTOSCARenderer from "./process-instance-diagram-overlay/opentosca/OpenTOSCARenderer";

export function addSubprocessToggleButton(viewer, options, {control}) {
    const canvas = viewer.get("canvas")
    new OpenTOSCARenderer(viewer.get("eventBus"), viewer.get("styles"), viewer.get("bpmnRenderer"), viewer.get("textRenderer"), canvas)
    const actionButtonElement = document.createElement("button")
    let showSubProcesses = false

    const elementRegistry = viewer.get("elementRegistry")
    const drilldownOverlayBehavior = viewer.get("drilldownOverlayBehavior")


    const update = () => {
        const subProcesses = []
        const findSubprocesses = (element) => {
            if(element.businessObject.get('opentosca:deploymentModelUrl')) {
                subProcesses.push(element)
            }
            if (element.type === "bpmn:SubProcess") {
                console.log(element)
                if (!element.collapsed) {
                    element.children.forEach(findSubprocesses)
                }
            }
        }
        canvas.getRootElement().children.forEach(findSubprocesses)
        actionButtonElement.innerText = showSubProcesses ? "Hide Deployment Sub Processes" : "Show Deployment Sub Processes"
        for (const subProcess of subProcesses) {
            //if (subProcess.parent !== canvas.getRootElement() && subProcess.parent.collapsed) continue;
            const newType = showSubProcesses ? "bpmn:SubProcess" : "bpmn:ServiceTask"
            if (subProcess.type !== newType) {
                canvas.removeShape(subProcess)
                subProcess.type = newType
                canvas.addShape(subProcess)
                if (showSubProcesses) {
                    drilldownOverlayBehavior.addOverlay(subProcess)
                }
            }
        }
    }
    update()
    actionButtonElement.addEventListener("click", () => {
        showSubProcesses = !showSubProcesses;
        update()
    })
    control.addAction({html: actionButtonElement})
}