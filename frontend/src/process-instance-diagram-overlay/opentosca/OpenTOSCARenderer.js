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

import {
  createLine,
} from 'diagram-js/lib/util/RenderUtil';
import { getOrientation } from "diagram-js/lib/layout/LayoutUtil";
import { connectPoints } from "diagram-js/lib/layout/ManhattanLayout";

const buttonIcon = "<svg width=\"147\" height=\"162\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" overflow=\"hidden\"><defs><clipPath id=\"clip0\"><rect x=\"0\" y=\"0\" width=\"147\" height=\"162\"/></clipPath><linearGradient x1=\"74.0001\" y1=\"2.49748\" x2=\"74.0001\" y2=\"160.335\" gradientUnits=\"userSpaceOnUse\" spreadMethod=\"reflect\" id=\"fill1\"><stop offset=\"0\" stop-color=\"#FFFFFF\"/><stop offset=\"0.027027\" stop-color=\"#FEFEFE\"/><stop offset=\"0.0540541\" stop-color=\"#FEFEFE\"/><stop offset=\"0.0810811\" stop-color=\"#FEFEFE\"/><stop offset=\"0.108108\" stop-color=\"#FEFEFE\"/><stop offset=\"0.135135\" stop-color=\"#FEFEFE\"/><stop offset=\"0.162162\" stop-color=\"#FDFDFD\"/><stop offset=\"0.189189\" stop-color=\"#FDFDFD\"/><stop offset=\"0.216216\" stop-color=\"#FCFCFC\"/><stop offset=\"0.243243\" stop-color=\"#FCFCFC\"/><stop offset=\"0.27027\" stop-color=\"#FBFBFB\"/><stop offset=\"0.297297\" stop-color=\"#FBFBFB\"/><stop offset=\"0.324324\" stop-color=\"#FAFAFA\"/><stop offset=\"0.351351\" stop-color=\"#F9F9F9\"/><stop offset=\"0.378378\" stop-color=\"#F8F8F8\"/><stop offset=\"0.405405\" stop-color=\"#F8F8F8\"/><stop offset=\"0.432432\" stop-color=\"#F7F7F7\"/><stop offset=\"0.459459\" stop-color=\"#F6F6F6\"/><stop offset=\"0.486486\" stop-color=\"#F5F5F5\"/><stop offset=\"0.513514\" stop-color=\"#F4F4F4\"/><stop offset=\"0.540541\" stop-color=\"#F3F3F3\"/><stop offset=\"0.567568\" stop-color=\"#F1F1F1\"/><stop offset=\"0.594595\" stop-color=\"#F0F0F0\"/><stop offset=\"0.621622\" stop-color=\"#EFEFEF\"/><stop offset=\"0.648649\" stop-color=\"#EEEEEE\"/><stop offset=\"0.675676\" stop-color=\"#ECECEC\"/><stop offset=\"0.702703\" stop-color=\"#EBEBEB\"/><stop offset=\"0.72973\" stop-color=\"#E9E9E9\"/><stop offset=\"0.756757\" stop-color=\"#E8E8E8\"/><stop offset=\"0.783784\" stop-color=\"#E6E6E6\"/><stop offset=\"0.810811\" stop-color=\"#E5E5E5\"/><stop offset=\"0.837838\" stop-color=\"#E3E3E3\"/><stop offset=\"0.864865\" stop-color=\"#E2E2E2\"/><stop offset=\"0.891892\" stop-color=\"#E0E0E0\"/><stop offset=\"0.918919\" stop-color=\"#DEDEDE\"/><stop offset=\"0.945946\" stop-color=\"#DCDCDC\"/><stop offset=\"0.972973\" stop-color=\"#DADADA\"/><stop offset=\"1\" stop-color=\"#D9D9D9\"/></linearGradient><linearGradient x1=\"74.0001\" y1=\"2.49748\" x2=\"74.0001\" y2=\"160.335\" gradientUnits=\"userSpaceOnUse\" spreadMethod=\"reflect\" id=\"fill2\"><stop offset=\"0\" stop-color=\"#CDCDCD\"/><stop offset=\"0.0333333\" stop-color=\"#CCCCCC\"/><stop offset=\"0.0666667\" stop-color=\"#CCCCCC\"/><stop offset=\"0.1\" stop-color=\"#CCCCCC\"/><stop offset=\"0.133333\" stop-color=\"#CCCCCC\"/><stop offset=\"0.166667\" stop-color=\"#CBCBCB\"/><stop offset=\"0.2\" stop-color=\"#CBCBCB\"/><stop offset=\"0.233333\" stop-color=\"#CACACA\"/><stop offset=\"0.266667\" stop-color=\"#CACACA\"/><stop offset=\"0.3\" stop-color=\"#C9C9C9\"/><stop offset=\"0.333333\" stop-color=\"#C9C9C9\"/><stop offset=\"0.366667\" stop-color=\"#C8C8C8\"/><stop offset=\"0.4\" stop-color=\"#C7C7C7\"/><stop offset=\"0.433333\" stop-color=\"#C6C6C6\"/><stop offset=\"0.466667\" stop-color=\"#C5C5C5\"/><stop offset=\"0.5\" stop-color=\"#C4C4C4\"/><stop offset=\"0.533333\" stop-color=\"#C3C3C3\"/><stop offset=\"0.566667\" stop-color=\"#C2C2C2\"/><stop offset=\"0.6\" stop-color=\"#C1C1C1\"/><stop offset=\"0.633333\" stop-color=\"#BFBFBF\"/><stop offset=\"0.666667\" stop-color=\"#BEBEBE\"/><stop offset=\"0.7\" stop-color=\"#BDBDBD\"/><stop offset=\"0.733333\" stop-color=\"#BBBBBB\"/><stop offset=\"0.766667\" stop-color=\"#BABABA\"/><stop offset=\"0.8\" stop-color=\"#B8B8B8\"/><stop offset=\"0.833333\" stop-color=\"#B6B6B6\"/><stop offset=\"0.866667\" stop-color=\"#B5B5B5\"/><stop offset=\"0.9\" stop-color=\"#B3B3B3\"/><stop offset=\"0.933333\" stop-color=\"#B1B1B1\"/><stop offset=\"0.966667\" stop-color=\"#AFAFAF\"/><stop offset=\"1\" stop-color=\"#AEAEAE\"/></linearGradient></defs><g clip-path=\"url(#clip0)\"><rect x=\"0\" y=\"0\" width=\"147\" height=\"161.834\" fill=\"#FFFFFF\"/><path d=\"M2.50005 2.49748 145.5 2.49748 145.5 147.041 132.193 160.335 2.50005 160.335Z\" fill=\"url(#fill1)\" fill-rule=\"evenodd\"/><path d=\"M132.193 160.335 134.854 149.7 145.5 147.041Z\" fill=\"url(#fill2)\" fill-rule=\"evenodd\"/><path d=\"M132.193 160.335 134.854 149.7 145.5 147.041 132.193 160.335 2.50005 160.335 2.50005 2.49748 145.5 2.49748 145.5 147.041\" stroke=\"#404040\" stroke-miterlimit=\"8\" fill=\"none\" fill-rule=\"evenodd\"/><path d=\"M24.5001 105.891C24.5001 101.753 27.858 98.3988 32.0002 98.3988L79.9999 98.3988C84.1421 98.3988 87.5001 101.753 87.5001 105.891L87.5001 135.86C87.5001 139.998 84.1421 143.352 79.9999 143.352L32.0002 143.352C27.858 143.352 24.5001 139.998 24.5001 135.86Z\" stroke=\"#404040\" stroke-miterlimit=\"8\" fill=\"#FFFFFF\" fill-rule=\"evenodd\"/><path d=\"M24.5001 26.9724C24.5001 22.8345 27.858 19.48 32.0002 19.48L79.9999 19.48C84.1421 19.48 87.5001 22.8345 87.5001 26.9724L87.5001 56.9413C87.5001 61.0792 84.1421 64.4337 79.9999 64.4337L32.0002 64.4337C27.858 64.4337 24.5001 61.0792 24.5001 56.9413Z\" stroke=\"#404040\" stroke-miterlimit=\"8\" fill=\"#FFFFFF\" fill-rule=\"evenodd\"/><path d=\"M56 63.9342 56.0001 91.2948\" stroke=\"#404040\" stroke-width=\"3.66667\" stroke-miterlimit=\"8\" fill=\"none\" fill-rule=\"evenodd\"/><path d=\"M0 17.9815 12.9866 0 25.9733 17.9815Z\" fill=\"#404040\" fill-rule=\"evenodd\" transform=\"matrix(1.00103 0 0 -1 43 97.8993)\"/><text fill=\"#404040\" font-family=\"Calibri,Calibri_MSFontService,sans-serif\" font-weight=\"700\" font-size=\"64\" transform=\"matrix(1 0 0 0.998972 94.6548 101)\">D</text></g></svg>"
import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
  select as svgSelect,
  prepend as svgPrepend,
  innerSVG
} from 'tiny-svg';
import { query as domQuery } from 'min-dom';

const HIGH_PRIORITY = 14001;
const SERVICE_TASK_TYPE = 'bpmn:ServiceTask';
const DEPLOYMENT_GROUP_ID = 'deployment';
const DEPLOYMENT_REL_MARKER_ID = 'deployment-rel';

const LABEL_WIDTH = 65;
const LABEL_HEIGHT = 15;
const NODE_WIDTH = 100;
const NODE_HEIGHT = 60;
const NODE_SHIFT_MARGIN = 10;
const STROKE_STYLE = {
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  stroke: '#777777',
  strokeWidth: 2,
  strokeDasharray: 4,
};

const STROKE_STYLEOVERLAY = {
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  stroke: '#777777',
  strokeWidth: 2,
  strokeDasharray: 4,
};

async function getVMQProvData(qProvEndpoint) {
  const apiEndpoint = `${qProvEndpoint}/characteristics`;
  console.log(apiEndpoint);
  try {
    const response = await fetch(apiEndpoint);
    const data = await response.json();

    // Extract the list of hardware characteristics
    if (data !== null) {
      if (data._embedded !== undefined) {
        const hardwareCharacteristics = data._embedded.hardwareCharacteristicsDtoes;

        // Sort the array based on the recordingTime in descending order
        const sortedData = hardwareCharacteristics.sort((a, b) => new Date(b.recordingTime) - new Date(a.recordingTime));

        // Get the data with the latest timestamp
        const latestData = sortedData[0];

        // Log the result
        console.log(latestData);

        if (latestData) {
          return latestData;
        } else {
          console.log(`No data collected.`);
          return null;
        }
      }
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

async function loadTopology(deploymentModelUrl) {
  let topology;
  let tags;
  try {
    topology = await fetch(deploymentModelUrl.replace('?csar', 'topologytemplate'),
      { headers: { "Accept": "application/json" } })
      .then(res => res.json());
    tags = await fetch(deploymentModelUrl.replace('?csar', 'tags'),
      { headers: { "Accept": "application/json" } })
      .then(res => res.json());

  } catch (e) {
    throw new Error('An unexpected error occurred during loading the deployments models topology.');
  }
  let topNode;
  const topNodeTag = tags.find(tag => tag.name === "top-node");
  if (topNodeTag) {
    const topNodeId = topNodeTag.value;
    topNode = topology.nodeTemplates.find(nodeTemplate => nodeTemplate.id === topNodeId);
    if (!topNode) {
      throw new Error(`Top level node "${topNodeId}" not found.`);
    }
  } else {
    let nodes = new Map(topology.nodeTemplates.map(nodeTemplate => [nodeTemplate.id, nodeTemplate]));
    for (let relationship of topology.relationshipTemplates) {
      if (relationship.name === "HostedOn") {
        nodes.delete(relationship.targetElement.ref);
      }
    }
    if (nodes.size === 1) {
      topNode = nodes.values().next().value;
    }
  }
  if (!topNode) {
    throw new Error("No top level node found.");
  }

  return {
    topNode,
    nodeTemplates: topology.nodeTemplates,
    relationshipTemplates: topology.relationshipTemplates
  };
}

function drawTaskSVG(parentGfx, importSVG, svgAttributes, foreground) {
  const innerSvgStr = importSVG.svg,
    transformDef = importSVG.transform;

  const groupDef = svgCreate('g');
  svgAttr(groupDef, { transform: transformDef });
  innerSVG(groupDef, innerSvgStr);

  if (!foreground) {
    // set task box opacity to 0 such that icon can be in the background
    svgAttr(svgSelect(parentGfx, 'rect'), { 'fill-opacity': 0 });
  }

  if (svgAttributes) {
    svgAttr(groupDef, svgAttributes);
  }

  if (foreground) {
    parentGfx.append(groupDef);
  } else {
    parentGfx.prepend(groupDef);
  }
  return groupDef;
}

export default class OpenTOSCARenderer {
  constructor(eventBus, styles, bpmnRenderer, textRenderer, canvas) {
    eventBus.on(['render.shape'], HIGH_PRIORITY, (evt, context) => {
      const type = evt.type;
      const element = context.element;
      const parentGfx = context.gfx;
      const show = context.show;
      console.log("render")
      console.log(element);
      if (element.type === SERVICE_TASK_TYPE) {
        if (type === 'render.shape') {
          let task = bpmnRenderer.drawShape(parentGfx, element);
          //this.addSubprocessView(parentGfx, element, bpmnRenderer);
          this.showDeploymentModel(parentGfx, element, show);
          return task;
        }
      }
    });

    this.styles = styles;
    this.textRenderer = textRenderer;
    this.eventBus = eventBus;

    this.addMarkerDefinition(canvas);
    this.currentlyShownDeploymentsModels = new Map();
  }

  addMarkerDefinition(canvas) {
    const marker = svgCreate('marker', {
      id: DEPLOYMENT_REL_MARKER_ID,
      viewBox: '0 0 8 8',
      refX: 8,
      refY: 4,
      markerWidth: 8,
      markerHeight: 8,
      orient: 'auto'
    });
    svgAppend(marker, svgCreate('path', {
      d: 'M 0 0 L 8 4 L 0 8',
      ...this.styles.computeStyle({}, ['no-fill'], {
        ...STROKE_STYLE,
        strokeWidth: 1,
        strokeDasharray: 2
      })
    }));

    let defs = domQuery('defs', canvas._svg);
    if (!defs) {
      defs = svgCreate('defs');

      svgPrepend(canvas._svg, defs);
    }
    svgAppend(defs, marker);
  }

  addSubprocessView(parentGfx, element, bpmnRenderer) {
    let deploymentModelUrl = element.businessObject.get('opentosca:deploymentModelUrl');
    let onDemand = element.businessObject.get('opentosca:onDemandDeployment');
    console.log(onDemand);
    console.log(deploymentModelUrl);
    if (!deploymentModelUrl || onDemand !== "true") return;

    let groupDef = svgCreate('g');
    svgAppend(parentGfx, svgCreate("path", {
      d: "M -590 -110 L 380 -110 L 380 210 L -145 210 L -150 195 L -155 210 L -590 210 Z",
      fill: "white",
      stroke: "#777777",
      "pointer-events": "all",
      transform: "translate(270, -147) scale(1.5, 0.7)"
    }));

    let xShift = -590;
    let yShift = -147;
    svgAttr(groupDef, { transform: `matrix(1, 0, 0, 1, ${xShift}, ${yShift})` });

    bpmnRenderer.drawShape(groupDef, {
      ...element,
      type: 'bpmn:StartEvent',
      height: 36,
      width: 36,
      businessObject: {
        isInterrupting: true
      }
    });
    svgAppend(parentGfx, groupDef);
    bpmnRenderer.drawConnection(parentGfx, {
      ...element,
      type: 'bpmn:SequenceFlow',
      businessObject: {},
      waypoints: [
        { x: xShift + 36, y: yShift + 18 },
        { x: xShift + 86, y: yShift + 18 },
      ]
    });
    xShift += 86;

    groupDef = svgCreate('g');
    svgAttr(groupDef, { transform: `matrix(1, 0, 0, 1, ${xShift}, ${yShift - 22})` });
    bpmnRenderer.drawShape(groupDef, {
      ...element,
      type: 'bpmn:ScriptTask',
      businessObject: {
        "name": "Adapt Model"
      }
    });
    svgAppend(parentGfx, groupDef);
    xShift += 100;

    bpmnRenderer.drawConnection(parentGfx, {
      ...element,
      type: 'bpmn:SequenceFlow',
      businessObject: {},
      waypoints: [
        { x: xShift, y: yShift + 18 },
        { x: xShift + 50, y: yShift + 18 },
      ]
    });
    xShift += 50;

    groupDef = svgCreate('g');
    svgAttr(groupDef, { transform: `matrix(1, 0, 0, 1, ${xShift}, ${yShift - 8})` });
    // Draw the ExclusiveGateway shape
    bpmnRenderer.drawShape(groupDef, {
      ...element,
      type: 'bpmn:ExclusiveGateway',
      height: 50,
      width: 50,
      businessObject: {
        name: "Dedicated Policy"
      }
    });

    // add the correct layout to gateway
    svgAppend(groupDef, svgCreate("path", {
      d: "m 16,15 7.42857142857143,9.714285714285715 -7.42857142857143,9.714285714285715 3.428571428571429,0 5.714285714285715,-7.464228571428572 5.714285714285715,7.464228571428572 3.428571428571429,0 -7.42857142857143,-9.714285714285715 7.42857142857143,-9.714285714285715 -3.428571428571429,0 -5.714285714285715,7.464228571428572 -5.714285714285715,-7.464228571428572 -3.428571428571429,0 z",
      style: "fill: rgb(34, 36, 42); stroke-linecap: round; stroke-linejoin: round; stroke: rgb(34, 36, 42); stroke-width: 1px;"
    }));

    // Create a new text element
    var textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');

    // Adjust x and y considering the transformation applied to the 'g' element
    var adjustedX = 50 + parseFloat(groupDef.getAttribute('transform').split('(')[1].split(',')[4]);
    var adjustedY = 80 + parseFloat(groupDef.getAttribute('transform').split('(')[1].split(',')[5]);

    textElement.setAttribute('x', adjustedY); // Adjust the x-coordinate as needed
    textElement.setAttribute('y', adjustedY); // Adjust the y-coordinate as needed
    textElement.setAttribute('font-size', '12');
    textElement.textContent = 'Dedicated Policy?';

    // Append the text element to the 'g' element
    groupDef.appendChild(textElement);


    svgAppend(parentGfx, groupDef);

    svgAppend(parentGfx, groupDef);
    xShift += 50;

    bpmnRenderer.drawConnection(parentGfx, {
      ...element,
      type: 'bpmn:SequenceFlow',
      businessObject: {
        name: "no"
      },
      waypoints: [
        { x: xShift, y: yShift + 18 },
        { x: xShift + 50, y: yShift + 18 },
      ]
    });
    xShift += 50;

    // Create a new text element
    var textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');

    // Adjust x and y considering the transformation applied to the 'g' element
    var adjustedX = 50 + parseFloat(groupDef.getAttribute('transform').split('(')[1].split(',')[4]);
    var adjustedY = 210 + parseFloat(groupDef.getAttribute('transform').split('(')[1].split(',')[5]);

    textElement.setAttribute('x', adjustedY); // Adjust the x-coordinate as needed
    textElement.setAttribute('y', 10); // Adjust the y-coordinate as needed
    textElement.setAttribute('font-size', '12');
    textElement.textContent = 'no';

    // Append the text element to the 'g' element
    groupDef.appendChild(textElement);


    bpmnRenderer.drawConnection(parentGfx, {
      ...element,
      type: 'bpmn:SequenceFlow',
      businessObject: {
        name: "yes"
      },
      waypoints: [
        { x: xShift - 75, y: yShift + 50 },
        { x: xShift + 100, y: -25 },
        { x: xShift + 125, y: -25 },
        { x: xShift + 150, y: -25 },
        { x: xShift + 250, y: -25 },
        { x: xShift + 425, y: yShift + 50 },
      ]
    });

    // Create a new text element
    var textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');

    // Adjust x and y considering the transformation applied to the 'g' element
    var adjustedX = 50 + parseFloat(groupDef.getAttribute('transform').split('(')[1].split(',')[4]);
    var adjustedY = 210 + parseFloat(groupDef.getAttribute('transform').split('(')[1].split(',')[5]);

    textElement.setAttribute('x', adjustedY); // Adjust the x-coordinate as needed
    textElement.setAttribute('y', 10); // Adjust the y-coordinate as needed
    textElement.setAttribute('font-size', '12');
    textElement.textContent = 'yes';

    // Append the text element to the 'g' element
    groupDef.appendChild(textElement);



    groupDef = svgCreate('g');
    svgAttr(groupDef, { transform: `matrix(1, 0, 0, 1, ${xShift}, ${yShift - 22})` });
    bpmnRenderer.drawShape(groupDef, {
      ...element,
      type: 'bpmn:ScriptTask',
      businessObject: {
        "name": "Check For Equivalent Deployment Model"
      }
    });
    svgAppend(parentGfx, groupDef);

    bpmnRenderer.drawConnection(parentGfx, {
      ...element,
      type: 'bpmn:SequenceFlow',
      businessObject: {},
      waypoints: [
        { x: xShift + 100, y: yShift + 18 },
        { x: xShift + 150, y: yShift + 18 },
      ]
    });
    xShift += 150;

    groupDef = svgCreate('g');
    svgAttr(groupDef, { transform: `matrix(1, 0, 0, 1, ${xShift}, ${yShift - 22})` });
    bpmnRenderer.drawShape(groupDef, {
      ...element,
      type: 'bpmn:ScriptTask',
      businessObject: {
        "name": "Check Container For Available Instance"
      }
    });
    svgAppend(parentGfx, groupDef);

    bpmnRenderer.drawConnection(parentGfx, {
      ...element,
      type: 'bpmn:SequenceFlow',
      businessObject: {},
      waypoints: [
        { x: xShift + 100, y: yShift + 18 },
        { x: xShift + 150, y: yShift + 18 },
      ]
    });

    xShift += 150;

    groupDef = svgCreate('g');
    svgAttr(groupDef, { transform: `matrix(1, 0, 0, 1, ${xShift}, ${yShift - 8})` });
    // Draw the ExclusiveGateway shape
    bpmnRenderer.drawShape(groupDef, {
      ...element,
      type: 'bpmn:ExclusiveGateway',
      height: 50,
      width: 50,
      businessObject: {
        name: "Dedicated Policy"
      }
    });

    // add the correct layout to gateway
    svgAppend(groupDef, svgCreate("path", {
      d: "m 16,15 7.42857142857143,9.714285714285715 -7.42857142857143,9.714285714285715 3.428571428571429,0 5.714285714285715,-7.464228571428572 5.714285714285715,7.464228571428572 3.428571428571429,0 -7.42857142857143,-9.714285714285715 7.42857142857143,-9.714285714285715 -3.428571428571429,0 -5.714285714285715,7.464228571428572 -5.714285714285715,-7.464228571428572 -3.428571428571429,0 z",
      style: "fill: rgb(34, 36, 42); stroke-linecap: round; stroke-linejoin: round; stroke: rgb(34, 36, 42); stroke-width: 1px;"
    }));

    var textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');

    // Adjust x and y considering the transformation applied to the 'g' element
    var adjustedX = 50 + parseFloat(groupDef.getAttribute('transform').split('(')[1].split(',')[4]);
    var adjustedY = 50 + parseFloat(groupDef.getAttribute('transform').split('(')[1].split(',')[5]);

    textElement.setAttribute('x', adjustedY); // Adjust the x-coordinate as needed
    textElement.setAttribute('y', adjustedY); // Adjust the y-coordinate as needed
    textElement.setAttribute('font-size', '12');
    textElement.textContent = 'Instance Available?';

    // Append the text element to the 'g' element
    groupDef.appendChild(textElement);

    svgAppend(parentGfx, groupDef);

    bpmnRenderer.drawConnection(parentGfx, {
      ...element,
      type: 'bpmn:SequenceFlow',
      businessObject: {},
      waypoints: [
        { x: xShift + 50, y: yShift + 18 },
        { x: xShift + 100, y: yShift + 18 },
      ]
    });
    xShift += 100;
    // Create a new text element
    var textElement = document.createElementNS('http://www.w3.org/2000/svg', 'text');

    // Adjust x and y considering the transformation applied to the 'g' element
    var adjustedX = 50 + parseFloat(groupDef.getAttribute('transform').split('(')[1].split(',')[4]);
    var adjustedY = 210 + parseFloat(groupDef.getAttribute('transform').split('(')[1].split(',')[5]);

    textElement.setAttribute('x', adjustedY); // Adjust the x-coordinate as needed
    textElement.setAttribute('y', 10); // Adjust the y-coordinate as needed
    textElement.setAttribute('font-size', '12');
    textElement.textContent = 'no';

    // Append the text element to the 'g' element
    groupDef.appendChild(textElement);


    groupDef = svgCreate('g');
    svgAttr(groupDef, { transform: `matrix(1, 0, 0, 1, ${xShift}, ${yShift - 8})` });
    // Draw the ExclusiveGateway shape
    bpmnRenderer.drawShape(groupDef, {
      ...element,
      type: 'bpmn:ExclusiveGateway',
      height: 50,
      width: 50,
      businessObject: {
        name: "Dedicated Policy"
      }
    });

    // add the correct layout to gateway
    svgAppend(groupDef, svgCreate("path", {
      d: "m 16,15 7.42857142857143,9.714285714285715 -7.42857142857143,9.714285714285715 3.428571428571429,0 5.714285714285715,-7.464228571428572 5.714285714285715,7.464228571428572 3.428571428571429,0 -7.42857142857143,-9.714285714285715 7.42857142857143,-9.714285714285715 -3.428571428571429,0 -5.714285714285715,7.464228571428572 -5.714285714285715,-7.464228571428572 -3.428571428571429,0 z",
      style: "fill: rgb(34, 36, 42); stroke-linecap: round; stroke-linejoin: round; stroke: rgb(34, 36, 42); stroke-width: 1px;"
    }));



    svgAppend(parentGfx, groupDef);
    xShift += 50;

    bpmnRenderer.drawConnection(parentGfx, {
      ...element,
      type: 'bpmn:SequenceFlow',
      businessObject: {},
      waypoints: [
        { x: xShift, y: yShift + 18 },
        { x: xShift + 50, y: yShift + 18 },
      ]
    });
    xShift += 50;
    groupDef = svgCreate('g');
    svgAttr(groupDef, { transform: `matrix(1, 0, 0, 1, ${xShift}, ${yShift - 22})` });
    bpmnRenderer.drawShape(groupDef, {
      ...element,
      type: 'bpmn:ScriptTask',
      businessObject: {
        "name": "Upload to Container"
      }
    });
    svgAppend(parentGfx, groupDef);
    xShift += 100;

    bpmnRenderer.drawConnection(parentGfx, {
      ...element,
      type: 'bpmn:SequenceFlow',
      businessObject: {},
      waypoints: [
        { x: xShift, y: yShift + 18 },
        { x: xShift + 50, y: yShift + 18 },
      ]
    });
    xShift += 50;

    groupDef = svgCreate('g');
    svgAttr(groupDef, { transform: `matrix(1, 0, 0, 1, ${xShift}, ${yShift - 22})` });
    bpmnRenderer.drawShape(groupDef, {
      ...element,
      type: 'bpmn:ScriptTask',
      businessObject: {
        "name": "Deploy Service"
      }
    });
    svgAppend(parentGfx, groupDef);

    bpmnRenderer.drawConnection(parentGfx, {
      ...element,
      type: 'bpmn:SequenceFlow',
      businessObject: {},
      waypoints: [
        { x: xShift + 100, y: yShift + 18 },
        { x: xShift + 150, y: yShift + 18 },
      ]
    });
    xShift += 150;

    groupDef = svgCreate('g');
    svgAttr(groupDef, { transform: `matrix(1, 0, 0, 1, ${xShift}, ${yShift - 8})` });
    // Draw the ExclusiveGateway shape
    bpmnRenderer.drawShape(groupDef, {
      ...element,
      type: 'bpmn:ExclusiveGateway',
      height: 50,
      width: 50,
      businessObject: {
        name: "Dedicated Policy"
      }
    });

    // add the correct layout to gateway
    svgAppend(groupDef, svgCreate("path", {
      d: "m 16,15 7.42857142857143,9.714285714285715 -7.42857142857143,9.714285714285715 3.428571428571429,0 5.714285714285715,-7.464228571428572 5.714285714285715,7.464228571428572 3.428571428571429,0 -7.42857142857143,-9.714285714285715 7.42857142857143,-9.714285714285715 -3.428571428571429,0 -5.714285714285715,7.464228571428572 -5.714285714285715,-7.464228571428572 -3.428571428571429,0 z",
      style: "fill: rgb(34, 36, 42); stroke-linecap: round; stroke-linejoin: round; stroke: rgb(34, 36, 42); stroke-width: 1px;"
    }));



    svgAppend(parentGfx, groupDef);
    xShift += 50;

    bpmnRenderer.drawConnection(parentGfx, {
      ...element,
      type: 'bpmn:SequenceFlow',
      businessObject: {},
      waypoints: [
        { x: xShift, y: yShift + 18 },
        { x: xShift + 50, y: yShift + 18 },
      ]
    });
    xShift += 50;

    groupDef = svgCreate('g');
    svgAttr(groupDef, { transform: `matrix(1, 0, 0, 1, ${xShift}, ${yShift - 22})` });
    bpmnRenderer.drawShape(groupDef, {
      ...element,
      type: 'bpmn:ServiceTask',
      businessObject: {
        "name": "Invoke Service"
      }
    });
    svgAppend(parentGfx, groupDef);

    bpmnRenderer.drawConnection(parentGfx, {
      ...element,
      type: 'bpmn:SequenceFlow',
      businessObject: {},
      waypoints: [
        { x: xShift + 100, y: yShift + 18 },
        { x: xShift + 136, y: yShift + 18 },
      ]
    });
    xShift += 136;

    groupDef = svgCreate('g');
    svgAttr(groupDef, { transform: `matrix(1, 0, 0, 1, ${xShift}, ${yShift})` });
    bpmnRenderer.drawShape(groupDef, {
      ...element,
      height: 36,
      width: 36,
      type: 'bpmn:EndEvent',
      businessObject: {}
    });
    svgAppend(parentGfx, groupDef);

  }

  showOrDeleteDeploymentModel(parentGfx, element) {
    console.log("showordelete")
    console.log(element)
    console.log(element.showDeploymentModel)
    if (element.showDeploymentModel) {
      this.showDeploymentModel(parentGfx, element);
    } else {
      console.log("remove deploymentmodel")
      this.removeDeploymentModel(parentGfx, element);
    }
  }

  async showDeploymentModel(parentGfx, element, show) {
    let deploymentModelUrl = element.businessObject.get('opentosca:deploymentModelUrl');
    let qprovEndpoint = element.businessObject.get("qProvUrl");
    if (!deploymentModelUrl || deploymentModelUrl.includes('wineryEndpoint')) return;
    const button = drawTaskSVG(parentGfx, {
      transform: 'matrix(0.3, 0, 0, 0.3, 85, 65)',
      svg: buttonIcon
    }, null, true);
    button.style['pointer-events'] = 'all';
    button.style['cursor'] = 'pointer';
    button.addEventListener('click', (e) => {
      e.preventDefault();
      console.log("click")
      element.deploymentModelTopology = undefined;
      console.log(show)
      element.showDeploymentModel = !element.showDeploymentModel;
      console.log(element)
      this.showOrDeleteDeploymentModel(parentGfx, element);
    });

    const groupDef = svgCreate("g", { id: DEPLOYMENT_GROUP_ID });
    parentGfx.prepend(groupDef);

    const { topNode, nodeTemplates, relationshipTemplates } =
      await loadTopology(deploymentModelUrl);


    let ySubtract = parseInt(topNode.y);
    let xSubtract = parseInt(topNode.x);
    let xMin = 0;
    let xMax = 0;
    let yMax = 0;


    const positions = new Map();
    for (let nodeTemplate of nodeTemplates) {
      console.log("NODETEMPLATE")
      console.log(nodeTemplate)


      const position = {
        x: (parseInt(nodeTemplate.x) - xSubtract) / 1.4,
        y: (parseInt(nodeTemplate.y) - ySubtract) / 1.4,
      };

      if (position.x < xMin) {
        xMin = position.x;
      }
      if (position.x > xMax) {
        xMax = position.x;
      }
      if (position.y > yMax) {
        yMax = position.y;
      }
      positions.set(nodeTemplate.id, position);
      if (nodeTemplate.id !== topNode.id) {
        this.drawNodeTemplate(groupDef, nodeTemplate, position, element);
        const namePattern = /\}(.*)/g;
        const typeMatches = namePattern.exec(nodeTemplate.type);
        let typeName;
        if (typeMatches === null || typeMatches.length === 0) {
          typeName = nodeTemplate.type;
        } else {
          typeName = typeMatches[1];
        }
        console.log(typeName)

      }

    }
    const boundingBox = {
      left: Math.min(...[...positions.values()].map((p) => p.x)) + element.x,
      top: Math.min(...[...positions.values()].map((p) => p.y)) + element.y,
      right:
        Math.max(...[...positions.values()].map((p) => p.x)) +
        NODE_WIDTH +
        element.x,
      bottom:
        Math.max(...[...positions.values()].map((p) => p.y)) +
        NODE_HEIGHT +
        element.y,
    };

    this.currentlyShownDeploymentsModels.set(element.id, {
      boundingBox,
    });

    this.drawNodeConnections(
      groupDef,
      topNode,
      relationshipTemplates,
      positions
    );
    this.drawTopologyOverlay(groupDef, xMin - NODE_SHIFT_MARGIN / 2, xMax + NODE_WIDTH + NODE_SHIFT_MARGIN / 2, yMax + NODE_HEIGHT + NODE_SHIFT_MARGIN / 2);
  }

  drawTopologyOverlay(parentGfx, xMin, xMax, yMax) {
    svgPrepend(parentGfx, svgCreate("path", {
      d: `M 0 ${80 - NODE_SHIFT_MARGIN} L ${xMax.toFixed(2)} ${80 - NODE_SHIFT_MARGIN} L ${xMax.toFixed(2)} ${yMax.toFixed(2)}   L ${xMin.toFixed(2)} ${yMax.toFixed(2)}   L ${xMin.toFixed(2)} ${80 - NODE_SHIFT_MARGIN}  L 0 ${80 - NODE_SHIFT_MARGIN}  Z`,
      fill: "white",
      stroke: "#777777",
      "pointer-events": "all"
    }));
  }

  drawNodeConnections(
    parentGfx,
    topNode,
    relationshipTemplates,
    nodePositions
  ) {
    const connectionsAtNodeLocations = new Map();
    const connections = [];

    const addToPort = (node, location, otherNode) => {
      const key = node.ref + "-" + location;
      let nodesAtPort = connectionsAtNodeLocations.get(key);
      if (!nodesAtPort) {
        nodesAtPort = [];
        connectionsAtNodeLocations.set(key, nodesAtPort);
      }
      nodesAtPort.push(otherNode);
    };

    const addConnection = (
      source,
      sourceLocation,
      target,
      targetLocation,
      connectionName
    ) => {
      addToPort(source, sourceLocation, target);
      addToPort(target, targetLocation, source);
      connections.push({
        source,
        target,
        sourceLocation,
        targetLocation,
        connectionName,
      });
    };

    for (let relationshipTemplate of relationshipTemplates) {
      const sourceRef = relationshipTemplate.sourceElement.ref;
      const targetRef = relationshipTemplate.targetElement.ref;
      const source = {
        width: NODE_WIDTH,
        height: sourceRef === topNode.id ? 80 : NODE_HEIGHT,
        ref: sourceRef,
        ...nodePositions.get(sourceRef),
      };
      const target = {
        width: NODE_WIDTH,
        height: sourceRef === topNode.id ? 80 : NODE_HEIGHT,
        ref: targetRef,
        ...nodePositions.get(targetRef),
      };
      const orientation = getOrientation(source, target, 0);

      switch (orientation) {
        case "intersect":
        case "bottom":
          addConnection(
            source,
            "north",
            target,
            "south",
            relationshipTemplate.name
          );
          break;
        case "top":
          addConnection(
            source,
            "south",
            target,
            "north",
            relationshipTemplate.name
          );
          break;
        case "right":
          addConnection(
            source,
            "east",
            target,
            "west",
            relationshipTemplate.name
          );
          break;
        case "left":
          addConnection(
            source,
            "west",
            target,
            "east",
            relationshipTemplate.name
          );
          break;
        case "top-left":
          addConnection(
            source,
            "south",
            target,
            "east",
            relationshipTemplate.name
          );
          break;
        case "top-right":
          addConnection(
            source,
            "south",
            target,
            "west",
            relationshipTemplate.name
          );
          break;
        case "bottom-left":
          addConnection(
            source,
            "north",
            target,
            "east",
            relationshipTemplate.name
          );
          break;
        case "bottom-right":
          addConnection(
            source,
            "north",
            target,
            "west",
            relationshipTemplate.name
          );
          break;
        default:
          return;
      }
    }

    for (const connection of connections) {
      const getPortPoint = (element, location, otherNode) => {
        const connectionsAtNodeLocation = connectionsAtNodeLocations.get(
          element.ref + "-" + location
        );
        const locationIndex = connectionsAtNodeLocation.indexOf(otherNode) + 1;
        const portCount = connectionsAtNodeLocation.length;
        if (location === "north") {
          return {
            x: element.x + (element.width / (portCount + 1)) * locationIndex,
            y: element.y,
          };
        } else if (location === "south") {
          return {
            x: element.x + (element.width / (portCount + 1)) * locationIndex,
            y: element.y + element.height,
          };
        } else if (location === "east") {
          return {
            x: element.x,
            y: element.y + (element.height / (portCount + 1)) * locationIndex,
          };
        } else if (location === "west") {
          return {
            x: element.x + element.width,
            y: element.y + (element.height / (portCount + 1)) * locationIndex,
          };
        }
      };

      const getSimpleDirection = (direction) =>
        direction === "north" || direction === "south" ? "v" : "h";

      connectionsAtNodeLocations.forEach((value) => {
        if (value.length > 1) {
          value.sort((a, b) => {
            return a.y - b.y;
          });
        }
      });

      const points = connectPoints(
        getPortPoint(
          connection.source,
          connection.sourceLocation,
          connection.target
        ),
        getPortPoint(
          connection.target,
          connection.targetLocation,
          connection.source
        ),
        getSimpleDirection(connection.sourceLocation) +
        ":" +
        getSimpleDirection(connection.targetLocation)
      );

      const line = createLine(
        points,
        this.styles.computeStyle({}, ["no-fill"], {
          ...STROKE_STYLE,
          markerEnd: `url(#${DEPLOYMENT_REL_MARKER_ID})`,
        }),
        5
      );

      const labelGroup = svgCreate("g");

      const pathLength = line.getTotalLength();
      const middlePoint = line.getPointAtLength(pathLength / 2);
      svgAttr(labelGroup, {
        transform: `matrix(1, 0, 0, 1, ${(
          middlePoint.x -
          LABEL_WIDTH / 2
        ).toFixed(2)}, ${(middlePoint.y - LABEL_HEIGHT / 2).toFixed(2)})`,
      });
      const backgroundRect = svgCreate("rect", {
        width: LABEL_WIDTH,
        height: LABEL_HEIGHT,
        fill: "#EEEEEE",
        fillOpacity: 0.75,
      });
      svgAppend(labelGroup, backgroundRect);
      const text = this.textRenderer.createText(connection.connectionName, {
        box: {
          width: LABEL_WIDTH,
          height: LABEL_HEIGHT,
        },
        align: "center-middle",
        style: {
          fontSize: 10,
        },
        style: {
          fill: "black",
        },
      });
      svgAppend(labelGroup, text);
      parentGfx.prepend(labelGroup);
      parentGfx.prepend(line);
    }
  }

  removeDeploymentModel(parentGfx, element) {
    console.log("remove")
    console.log(this.currentlyShownDeploymentsModels)
    console.log(element.id)
    this.currentlyShownDeploymentsModels.delete(element.id);
    const group = svgSelect(parentGfx, "#" + DEPLOYMENT_GROUP_ID);
    console.log(group)
    if (group) {
      let visualElements = document.querySelector(`g.djs-element[data-element-id="${element.id}"]`);
      if (visualElements && visualElements.children.length > 0) {
        let firstChild = visualElements.children[0];
        let childrenOfFirstChild = firstChild.children;
        let childrenOfFirstChildArray = Array.from(childrenOfFirstChild);
        //childrenOfFirstChild.parentNode.removeChild(element);
        console.log(childrenOfFirstChildArray);
        for (let i = 0; i < childrenOfFirstChild.length; i++) {
          let child = childrenOfFirstChild[i];
          if (child.id === "deployment") {
            // Remove the child
            child.parentNode.removeChild(child);
            i--;
          }
        }
        console.log("remove group")
        group.remove();
      } else {
        console.error("No visual elements found or the first element has no children.");
      }

    }
  }

  async drawNodeTemplate(parentGfx, nodeTemplate, position, element) {
    const groupNodeTemplate = svgCreate("g");
    svgAttr(groupNodeTemplate, {
      transform: `matrix(1, 0, 0, 1, ${position.x.toFixed(
        2
      )}, ${position.y.toFixed(2)})`,
    });
    const rect = svgCreate("rect", {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      fill: "#DDDDDD",
      ...STROKE_STYLE,
    });

    svgAppend(groupNodeTemplate, rect);

    const nodeTemplateNameText = this.textRenderer.createText(nodeTemplate.name, {
      box: {
        width: NODE_WIDTH,
        height: NODE_HEIGHT / 2,
      },
      align: "center-middle",
      style: {
        fill: "black",
        "pointer-events":"none"
      },
    });

    svgAppend(groupNodeTemplate, nodeTemplateNameText);

    const groupDef2 = svgCreate("g");
    svgAttr(groupDef2, {
      transform: `matrix(1, 0, 0, 1, ${position.x.toFixed(2)}, ${(
        position.y +
        NODE_HEIGHT / 2
      ).toFixed(2)})`,
    });

    const namePattern = /\}(.*)/g;
    const typeMatches = namePattern.exec(nodeTemplate.type);
    let typeName;
    if (typeMatches === null || typeMatches.length === 0) {
      typeName = nodeTemplate.type;
    } else {
      typeName = typeMatches[1];
    }

    const nodeTypeNameText = this.textRenderer.createText("(" + typeName + ")", {
      box: {
        width: NODE_WIDTH,
        height: NODE_HEIGHT / 2,
      },
      align: "center-middle",
      style: {
        fill: "#777777",
        "pointer-events":"none",
      },
    });

    if (nodeTemplate.type.includes("Ubuntu-VM_20.04")) {


      //parentGfx.append(groupDef3);
      groupNodeTemplate.addEventListener('mouseenter', async () => {
        let qprovData = await getVMQProvData(element.businessObject.get("qProvUrl"));
        const groupVMAttributes = svgCreate("g", { id: element.id + "ubuntu_group" });
        const HORIZONTAL_SPACING = 50; // Adjust as needed
        const VERTICAL_SPACING = 12; // Adjust as needed
        svgAttr(groupVMAttributes, {
          transform: `matrix(1, 0, 0, 1, ${(position.x + NODE_WIDTH + HORIZONTAL_SPACING).toFixed(2)}, ${position.y.toFixed(2)})`,
        });

        const rect = svgCreate("rect", {
          width: 300,
          height: 170,
          fill: "white",
          stroke: "black",
          id: element.id + "_rect"
        });

        svgAppend(groupVMAttributes, rect);

        let textY = 0;
        let maxWidth = 300;
        let height = (NODE_HEIGHT / 2) + VERTICAL_SPACING;
        let i = 0;
        for (const [variable, value] of Object.entries(qprovData)) {
          const textContent = `${variable}: ${value}`;

          const text = this.textRenderer.createText(textContent, {
            box: {
              width: maxWidth,
              height: height
            },
            align: "left-top",
            style: {
              fill: "black",
            },

          });

          text.id = element.id + "_task" + i;
          console.log("update qprov attribute: ", text)
          text.children[0].setAttribute('y', 2 + (i+1)*12);
          text.children[0].setAttribute('x', 5);
          i++;
          height = height + VERTICAL_SPACING;

          const textWidth = text.getBBox().width;
          if (textWidth > maxWidth) {
            maxWidth = textWidth;
          }
          svgAppend(groupVMAttributes, text);
          textY += text.getBBox().height + VERTICAL_SPACING;
        }

        let totalHeight = (textY > NODE_HEIGHT ? textY : NODE_HEIGHT) + 7;
        svgAttr(rect, { height: totalHeight });
        parentGfx.append(groupVMAttributes);

      });
      groupNodeTemplate.addEventListener('mouseleave', async () => {
        const groupDef3 = document.getElementById(element.id + "ubuntu_group");
        if (groupDef3) {

          // Get the parent node of the element
          const parentElement = groupDef3.parentNode;

          // Remove the element from its parent
          parentElement.removeChild(groupDef3);

          groupDef3.remove();
        }
      });

    }



    svgAppend(groupDef2, nodeTypeNameText);
    parentGfx.append(groupNodeTemplate);
    parentGfx.append(groupDef2);

  }

  drawVMData(parentGfx, data, position) {
    const groupDef = svgCreate("g");
    svgAttr(groupDef, {
      transform: `matrix(1, 0, 0, 1, ${position.x.toFixed(
        2
      )}, ${position.y.toFixed(2)})`,
    });
    const rect = svgCreate("rect", {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
      fill: "#DDDDDD",
      ...STROKE_STYLE,
    });

    svgAppend(groupDef, rect);

    for (const [variable, value] of Object.entries(data)) {
      const text = this.textRenderer.createText(`${variable}: ${value}`, {
        box: {
          width: NODE_WIDTH,
          height: NODE_HEIGHT / 2,
        },
        align: "center-middle",
        style: {
          fill: "black",
        },
      });

      svgAppend(groupDef, text);
    }

    parentGfx.append(groupDef);
  }

  renderer(type) {
    return this.handlers[type];
  }

  canRender(element) {
    // only return true if handler for rendering is registered
    return this.openToscaHandlers[element.type];
  }

  drawShape(parentNode, element) {
    if (element.type in this.openToscaHandlers) {
      const h = this.openToscaHandlers[element.type];
      return h(this, parentNode, element);
    }
    return super.drawShape(parentNode, element);
  }
}
