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
  select,
  prepend as svgPrepend,
  innerSVG
} from 'tiny-svg';
import {query as domQuery} from 'min-dom';

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

async function loadTopology(deploymentModelUrl) {
  if (deploymentModelUrl.startsWith('{{ wineryEndpoint }}')) {
      deploymentModelUrl = deploymentModelUrl.replace('{{ wineryEndpoint }}', config.getWineryEndpoint());
  }
  let topology;
  let tags;
  try {
      topology = await fetch(deploymentModelUrl.replace('?csar', 'topologytemplate'),
          {headers: {"Accept": "application/json"}})
          .then(res => res.json());
      tags = await fetch(deploymentModelUrl.replace('?csar', 'tags'),
          {headers: {"Accept": "application/json"}})
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
  svgAttr(groupDef, {transform: transformDef});
  innerSVG(groupDef, innerSvgStr);

  if (!foreground) {
      // set task box opacity to 0 such that icon can be in the background
      svgAttr(svgSelect(parentGfx, 'rect'), {'fill-opacity': 0});
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
          const type = evt.type
          const element = context.element
          const parentGfx = context.gfx

          if (element.type === SERVICE_TASK_TYPE) {
              if (type === 'render.shape') {
                  const task = bpmnRenderer.drawShape(parentGfx, element);
                  this.addSubprocessView(parentGfx, element, bpmnRenderer);
                  this.maybeAddShowDeploymentModelButton(parentGfx, element);
                  return task
              }
          }
      });

      this.styles = styles;
      this.textRenderer = textRenderer;
      this.eventBus = eventBus;

      this.addMarkerDefinition(canvas);
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
      if (!deploymentModelUrl) return;

      let groupDef = svgCreate('g');
      svgAttr(groupDef, {transform: `matrix(1, 0, 0, 1, ${-238}, ${-78})`});
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
              {x: -200, y: -60},
              {x: -150, y: -60},
          ]
      });


      groupDef = svgCreate('g');
      svgAttr(groupDef, {transform: `matrix(1, 0, 0, 1, ${-150}, ${-100})`});
      bpmnRenderer.drawShape(groupDef, {
          ...element,
          type: 'bpmn:ScriptTask',
          businessObject: {
              "name": "Create deployment"
          }
      });
      svgAppend(parentGfx, groupDef);

      bpmnRenderer.drawConnection(parentGfx, {
          ...element,
          type: 'bpmn:SequenceFlow',
          businessObject: {},
          waypoints: [
              {x: -50, y: -60},
              {x: 0, y: -60},
          ]
      });

      groupDef = svgCreate('g');
      svgAttr(groupDef, {transform: `matrix(1, 0, 0, 1, ${0}, ${-100})`});
      bpmnRenderer.drawShape(groupDef, {
          ...element,
          type: 'bpmn:ScriptTask',
          businessObject: {
              "name": "Wait for deployment"
          }
      });
      svgAppend(parentGfx, groupDef);

      bpmnRenderer.drawConnection(parentGfx, {
          ...element,
          type: 'bpmn:SequenceFlow',
          businessObject: {},
          waypoints: [
              {x: 100, y: -60},
              {x: 150, y: -60},
          ]
      });

      groupDef = svgCreate('g');
      svgAttr(groupDef, {transform: `matrix(1, 0, 0, 1, ${150}, ${-100})`});
      bpmnRenderer.drawShape(groupDef, {
          ...element,
          type: 'bpmn:ServiceTask',
          businessObject: {
              "name": "Call service"
          }
      });
      svgAppend(parentGfx, groupDef);

      bpmnRenderer.drawConnection(parentGfx, {
          ...element,
          type: 'bpmn:SequenceFlow',
          businessObject: {},
          waypoints: [
              {x: 250, y: -60},
              {x: 300, y: -60},
          ]
      });

      groupDef = svgCreate('g');
      svgAttr(groupDef, {transform: `matrix(1, 0, 0, 1, ${301}, ${-78})`});
      bpmnRenderer.drawShape(groupDef, {
          ...element,
          height: 36,
          width: 36,
          type: 'bpmn:EndEvent',
          businessObject: {}
      });
      svgAppend(parentGfx, groupDef);

      svgAppend(parentGfx, svgCreate("path", {
          d: "M -260 -110 L 360 -110 L 360 -10   L 55 -10   L 50 -5  L 45 -10  L -260 -10 Z",
          fill: "none",
          stroke: "#777777",
          "pointer-events": "all"
      }));
  }

  maybeAddShowDeploymentModelButton(parentGfx, element) {
      let deploymentModelUrl = element.businessObject.get('opentosca:deploymentModelUrl');
      if (!deploymentModelUrl) return;

      const button = drawTaskSVG(parentGfx, {
          transform: 'matrix(0.3, 0, 0, 0.3, 85, 65)',
          svg: buttonIcon
      }, null, true);
      button.style['pointer-events'] = 'all';
      button.style['cursor'] = 'pointer';
      button.addEventListener('click', (e) => {
          e.preventDefault();
          element.deploymentModelTopology = undefined;
          element.showDeploymentModel = !element.showDeploymentModel;
          this.showOrDeleteDeploymentModel(parentGfx, element, deploymentModelUrl);
      });
      this.showOrDeleteDeploymentModel(parentGfx, element, deploymentModelUrl);
  }

  showOrDeleteDeploymentModel(parentGfx, element, deploymentModelUrl) {
      if (element.showDeploymentModel) {
          this.showDeploymentModel(parentGfx, element, deploymentModelUrl);
      } else {
          this.removeDeploymentModel(parentGfx, element);
      }
  }

  async showDeploymentModel(parentGfx, element, deploymentModelUrl) {
      if (!element.deploymentModelTopology || element.loadedDeploymentModelUrl !== deploymentModelUrl) {
          try {
              const topology = await loadTopology(deploymentModelUrl);
              element.loadedDeploymentModelUrl = deploymentModelUrl;
              element.deploymentModelTopology = topology;
          } catch (e) {
              element.showDeploymentModel = false;
              element.loadedDeploymentModelUrl = null;
              element.deploymentModelTopology = null;
              this.removeDeploymentModel(parentGfx, element);
              console.error(e);
              return;
          }
      }
      const groupDef = svgCreate('g', {id: DEPLOYMENT_GROUP_ID});
      parentGfx.prepend(groupDef);

      const {nodeTemplates, relationshipTemplates, topNode} = element.deploymentModelTopology;

      let ySubtract = parseInt(topNode.y);
      let xSubtract = parseInt(topNode.x);

      let xMin = 0;
      let xMax = 0;
      let yMax = 0;

      const positions = new Map();
      for (let nodeTemplate of nodeTemplates) {
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
              this.drawNodeTemplate(groupDef, nodeTemplate, position);
          }
      }

      this.drawNodeConnections(groupDef, topNode, relationshipTemplates, positions);
      this.drawTopologyOverlay(groupDef, xMin-NODE_SHIFT_MARGIN/2, xMax+NODE_WIDTH+NODE_SHIFT_MARGIN/2, yMax+NODE_HEIGHT+NODE_SHIFT_MARGIN/2);
  }

  drawTopologyOverlay(parentGfx, xMin, xMax, yMax) {
    svgPrepend(parentGfx, svgCreate("path", {
      d: `M 0 ${80-NODE_SHIFT_MARGIN} L ${xMax.toFixed(2)} ${80-NODE_SHIFT_MARGIN} L ${xMax.toFixed(2)} ${yMax.toFixed(2)}   L ${xMin.toFixed(2)} ${yMax.toFixed(2)}   L ${xMin.toFixed(2)} ${80-NODE_SHIFT_MARGIN}  L 0 ${80-NODE_SHIFT_MARGIN}  Z`,
      fill: "none",
      stroke: "#777777",
      "pointer-events": "all"
  }));
}

  removeDeploymentModel(parentGfx, element) {
      const group = select(parentGfx, '#' + DEPLOYMENT_GROUP_ID);
      if (group) {
          group.remove();
      }
  }

  drawNodeConnections(
      parentGfx,
      topNode,
      relationshipTemplates,
      nodePositions
    ) {
      const connectionCountAtNodeLocation = new Map();
      const connections = [];
  
      const addToPort = (nodeRef, location) => {
        const key = nodeRef + "-" + location;
        let position;
        if (connectionCountAtNodeLocation.has(key)) {
          position = connectionCountAtNodeLocation.get(key) + 1;
        } else {
          position = 1;
        }
        connectionCountAtNodeLocation.set(key, position);
        return position;
      };
  
      const addConnection = (
        sourceNode,
        sourceLocation,
        target,
        targetLocation,
        connectionName
      ) => {
        connections.push({
          source: sourceNode,
          target,
          sourceLocation,
          targetLocation,
          sourcePortIndex: addToPort(sourceNode.ref, sourceLocation),
          targetPortIndex: addToPort(target.ref, targetLocation),
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
        const getPortPoint = (element, location, locationIndex) => {
          const portCount = connectionCountAtNodeLocation.get(
            element.ref + "-" + location
          );
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
  
        const points = connectPoints(
          getPortPoint(
            connection.source,
            connection.sourceLocation,
            connection.sourcePortIndex
          ),
          getPortPoint(
            connection.target,
            connection.targetLocation,
            connection.targetPortIndex
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
        });
        svgAppend(labelGroup, text);
        parentGfx.prepend(labelGroup);
        parentGfx.prepend(line);
      }
    }

  drawNodeTemplate(parentGfx, nodeTemplate, position) {
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
  
      const text = this.textRenderer.createText(nodeTemplate.name, {
        box: {
          width: NODE_WIDTH,
          height: NODE_HEIGHT / 2,
        },
        align: "center-middle",
      });
  
      svgAppend(groupDef, text);
  
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
  
      const typeText = this.textRenderer.createText("(" + typeName + ")", {
        box: {
          width: NODE_WIDTH,
          height: NODE_HEIGHT / 2,
        },
        align: "center-middle",
        style: {
          fill: "#777777",
        },
      });
  
      svgAppend(groupDef2, typeText);
      parentGfx.append(groupDef);
      parentGfx.append(groupDef2);
    }
}