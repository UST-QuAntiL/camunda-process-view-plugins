/**
 * Copyright (c) 2023 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import * as quantmeReplaceOptions from "./QuantMEReplaceOptions";
import * as consts from "./Constants";
import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
  innerSVG,
  select as svgSelect,
} from "tiny-svg";
import { getFillColor, getStrokeColor } from "bpmn-js/lib/draw/BpmnRenderUtil";
import { getQuantMESVG } from "./QuantMESVGMap";
import { queryAll as domQueryAll } from "min-dom";

/**
 * This class extends the default BPMNRenderer to render the newly introduced QuantME task types
 */
export default class QuantMERenderer {
  constructor(eventBus, styles, bpmnRenderer, textRenderer, canvas) {
    eventBus.on(['render.shape'], 10000000000000, (evt, context) => {
      const type = evt.type;
      const element = context.element;
      const parentGfx = context.gfx;
      console.log(element);

      if (element.type === "bpmn:Task" || element.type === "bpmn:SubProcess") {
        if (type === 'render.shape') {
          let task = bpmnRenderer.drawShape(parentGfx, element);
          let attrs = element.businessObject.$attrs;
          if (attrs !== undefined) {
            let type = attrs["quantme:quantmeTaskType"];
            //if(type === consts.QUANTUM_HARDWARE_SELECTION_SUBPROCESS){
              //let subprocess = this.drawHardwareSelectionSubprocess(parentGfx, quantMEPathMap, element, task);
              //console.log("renderer subprocess")
              //return subprocess;
            if (type !== undefined) {
              console.log("task renderer")
              drawTaskSVG(parentGfx, type, null, true);
              //this.addOverlay(parentGfx, element, bpmnRenderer);
            }
            return task;
          }
        }
      }

      if (element.type === "bpmn:DataObjectReference") {
        if (type === 'render.shape') {
          console.log("render new")
          let task = bpmnRenderer.drawShape(parentGfx, element);
          let attrs = element.businessObject.$attrs;
          if (attrs !== undefined) {
            let type = attrs["quantmeTaskType"];
            console.log(type);
            if (type !== undefined) {
              drawDataObjectSVG(parentGfx, type, null, true);
            }
            return task;
          }
        }
      }

    });

    var computeStyle = styles.computeStyle;

    var defaultFillColor = "white",
      defaultStrokeColor = "white";

    function drawDataObjectSVG(parentGfx, iconID) {
      let importsvg = getQuantMESVG(iconID);
      let innerSVGstring = importsvg.svg;
      let transformDef = importsvg.transform;

      const groupDef = svgCreate("g");
      svgAttr(groupDef, { transform: transformDef });
      innerSVG(groupDef, innerSVGstring);
      let pathElement = parentGfx.querySelector("path");
      let existingCssText = pathElement.style.cssText;
      pathElement.style.cssText =
        existingCssText + " fill-opacity: 0 !important;";

      // draw svg in the background
      parentGfx.prepend(groupDef);
    }

    function drawTaskSVG(parentGfx, iconID, svgAttributes, foreground) {
      var importsvg = getQuantMESVG(iconID);
      var innerSVGstring = importsvg.svg;
      var transformDef = importsvg.transform;

      const groupDef = svgCreate("g");
      svgAttr(groupDef, { transform: transformDef });
      innerSVG(groupDef, innerSVGstring);

      // set task box opacity to 0 such that icon can be in the background
      svgAttr(svgSelect(parentGfx, "rect"), { "fill-opacity": 0 });

      // draw svg in the background
      parentGfx.prepend(groupDef);
    }

    function drawDataObjectSVG(parentGfx, iconID) {
      let importsvg = getQuantMESVG(iconID);
      let innerSVGstring = importsvg.svg;
      let transformDef = importsvg.transform;

      const groupDef = svgCreate("g");
      svgAttr(groupDef, { transform: transformDef });
      innerSVG(groupDef, innerSVGstring);
      let pathElement = parentGfx.querySelector("path");
      let existingCssText = pathElement.style.cssText;
      pathElement.style.cssText =
        existingCssText + " fill-opacity: 0 !important;";

      // draw svg in the background
      parentGfx.prepend(groupDef);
    }

    function drawPath(parentGfx, d, attrs) {
      attrs = computeStyle(attrs, ["no-fill"], {
        strokeWidth: 2,
        stroke: "black",
      });

      const path = svgCreate("path");
      svgAttr(path, { d: d });
      svgAttr(path, attrs);
      svgAppend(parentGfx, path);

      return path;
    }

    this.quantMeHandlers = {
      [consts.QUANTUM_HARDWARE_SELECTION_SUBPROCESS]: function (
        self,
        parentGfx,
        element
      ) {
        var subprocess = self.renderer("bpmn:SubProcess")(parentGfx, element);

        var pathData = quantMEPathMap.getPath(
          "SUBPROCESS_QUANTUM_HARDWARE_SELECTION"
        );
        drawPath(parentGfx, pathData, {
          transform: "scale(0.5)",
          strokeWidth: 1.5,
          fill: getFillColor(element, defaultFillColor),
          stroke: getStrokeColor(element, defaultStrokeColor),
        });

        // create circuit paths with filled shapes
        pathData = quantMEPathMap.getPath(
          "SUBPROCESS_QUANTUM_HARDWARE_SELECTION_FILL"
        );
        drawPath(parentGfx, pathData, {
          transform: "scale(0.5)",
          strokeWidth: 1.5,
          fill: getFillColor(element, "#000000"),
          stroke: getStrokeColor(element, defaultStrokeColor),
        });

        return subprocess;
      },
      [consts.CIRCUIT_CUTTING_SUBPROCESS]: function (self, parentGfx, element) {
        var subprocess = self.renderer("bpmn:SubProcess")(parentGfx, element);
        drawTaskSVG(parentGfx, "SUBPROCESS_TYPE_CIRCUIT_CUTTING");
        return subprocess;
      },
      [consts.CIRCUIT_CUTTING_TASK]: function (self, parentGfx, element) {
        var task = self.renderer("bpmn:Task")(parentGfx, element);
        drawTaskSVG(parentGfx, "SUBPROCESS_TYPE_CIRCUIT_CUTTING");
        return task;
      },
      [consts.CUTTING_RESULT_COMBINATION_TASK]: function (
        self,
        parentGfx,
        element
      ) {
        var task = self.renderer("bpmn:Task")(parentGfx, element);
        drawTaskSVG(parentGfx, "TASK_TYPE_RESULT_COMBINATION");
        return task;
      },
      [consts.QUANTUM_COMPUTATION_TASK]: function (self, parentGfx, element) {
        var task = self.renderer("bpmn:Task")(parentGfx, element);

        var pathData = quantMEPathMap.getPath("TASK_TYPE_QUANTUM_COMPUTATION");

        drawPath(parentGfx, pathData, {
          transform: "scale(0.3)",
          strokeWidth: 2.5,
          fill: getFillColor(element, defaultFillColor),
          stroke: getStrokeColor(element, defaultStrokeColor),
        });

        return task;
      },
      [consts.QUANTUM_CIRCUIT_LOADING_TASK]: function (
        self,
        parentGfx,
        element
      ) {
        var task = self.renderer("bpmn:Task")(parentGfx, element);

        // create circuit paths without filled shapes
        var pathData = quantMEPathMap.getPath("TASK_TYPE_CIRCUIT_LOADING");
        drawPath(parentGfx, pathData, {
          transform: "scale(0.3)",
          strokeWidth: 2.5,
          fill: getFillColor(element, defaultStrokeColor),
          stroke: getStrokeColor(element, defaultStrokeColor),
        });

        // create circuit paths with filled shapes
        pathData = quantMEPathMap.getPath("TASK_TYPE_CIRCUIT_LOADING_FILL");
        drawPath(parentGfx, pathData, {
          transform: "scale(0.3)",
          strokeWidth: 2.5,
          fill: getFillColor(element, "#000000"),
          stroke: getStrokeColor(element, defaultStrokeColor),
        });

        return task;
      },
      [consts.DATA_PREPARATION_TASK]: function (self, parentGfx, element) {
        var task = self.renderer("bpmn:Task")(parentGfx, element);

        var pathData = quantMEPathMap.getPath("TASK_TYPE_DATA_PREPARATION");
        drawPath(parentGfx, pathData, {
          transform: "scale(0.3)",
          strokeWidth: 2.5,
          fill: getFillColor(element, defaultFillColor),
          stroke: getStrokeColor(element, defaultStrokeColor),
        });

        // create circuit paths with filled shapes (black)
        pathData = quantMEPathMap.getPath(
          "TASK_TYPE_DATA_PREPARATION_FILL_BLACK"
        );
        drawPath(parentGfx, pathData, {
          transform: "scale(0.3)",
          strokeWidth: 2.5,
          fill: getFillColor(element, "#000000"),
          stroke: getStrokeColor(element, defaultStrokeColor),
        });

        // create circuit paths with filled shapes (background color)
        pathData = quantMEPathMap.getPath(
          "TASK_TYPE_DATA_PREPARATION_FILL_BACKGROUND"
        );
        drawPath(parentGfx, pathData, {
          transform: "scale(0.3)",
          strokeWidth: 2.5,
          fill: getFillColor(element, defaultStrokeColor),
          stroke: getStrokeColor(element, defaultStrokeColor),
        });

        // create circuit paths with dashed shapes
        pathData = quantMEPathMap.getPath("TASK_TYPE_DATA_PREPARATION_DASHED");
        drawPath(parentGfx, pathData, {
          transform: "scale(0.3)",
          strokeWidth: 2.5,
          strokeDasharray: 5,
          stroke: getStrokeColor(element, defaultStrokeColor),
        });

        // create white line for database
        pathData = quantMEPathMap.getPath(
          "TASK_TYPE_DATA_PREPARATION_BACKGROUND"
        );
        drawPath(parentGfx, pathData, {
          transform: "scale(0.3)",
          strokeWidth: 2.5,
          stroke: getFillColor(element, "#FFFFFF"),
        });

        return task;
      },
      [consts.ORACLE_EXPANSION_TASK]: function (self, parentGfx, element) {
        var task = self.renderer("bpmn:Task")(parentGfx, element);

        var pathData = quantMEPathMap.getPath("TASK_TYPE_ORACLE_EXPANSION");
        drawPath(parentGfx, pathData, {
          transform: "scale(0.3)",
          strokeWidth: 2.5,
          fill: getFillColor(element, defaultFillColor),
          stroke: getStrokeColor(element, defaultStrokeColor),
        });

        // create circuit paths with filled shapes
        pathData = quantMEPathMap.getPath(
          "TASK_TYPE_ORACLE_EXPANSION_FILL_BLACK"
        );
        drawPath(parentGfx, pathData, {
          transform: "scale(0.3)",
          strokeWidth: 2.5,
          fill: getFillColor(element, "#000000"),
          stroke: getStrokeColor(element, defaultStrokeColor),
        });

        // create oracle box
        pathData = quantMEPathMap.getPath("TASK_TYPE_ORACLE_EXPANSION_BOX");
        drawPath(parentGfx, pathData, {
          transform: "scale(0.3)",
          strokeWidth: 2.5,
          fill: getFillColor(element, "#000000"),
          stroke: getStrokeColor(element, "#FFF"),
        });

        // create arrow
        pathData = quantMEPathMap.getPath("TASK_TYPE_ORACLE_EXPANSION_ARROW");
        drawPath(parentGfx, pathData, {
          transform: "scale(0.3)",
          strokeWidth: 2.5,
          fill: getFillColor(element, "#000000"),
          stroke: getStrokeColor(element, defaultStrokeColor),
        });

        return task;
      },
      [consts.QUANTUM_CIRCUIT_EXECUTION_TASK]: function (
        self,
        parentGfx,
        element
      ) {
        var task = self.renderer("bpmn:Task")(parentGfx, element);

        var pathData = quantMEPathMap.getPath("TASK_TYPE_CIRCUIT_EXECUTION");
        drawPath(parentGfx, pathData, {
          transform: "scale(0.3)",
          strokeWidth: 2.5,
          fill: getFillColor(element, defaultFillColor),
          stroke: getStrokeColor(element, defaultStrokeColor),
        });

        pathData = quantMEPathMap.getPath("TASK_TYPE_CIRCUIT_EXECUTION_FILL");
        drawPath(parentGfx, pathData, {
          transform: "scale(0.3)",
          strokeWidth: 2.5,
          fill: getFillColor(element, "#000000"),
          stroke: getStrokeColor(element, defaultStrokeColor),
        });

        return task;
      },
    };

    setTimeout(function () {
      var existingDefs = domQueryAll("marker", canvas._svg);
      if (existingDefs != null) {
        var createdNewDefs = false;
        for (let i = 0; i < existingDefs.length; i++) {
          if (existingDefs[i].parentElement.parentElement.nodeName !== "svg") {
            if (createdNewDefs === false) {
              var newDefs = svgCreate("defs");
              svgAppend(canvas._svg, newDefs);
              createdNewDefs = true;
            }
            svgAppend(newDefs, existingDefs[i]);
          }
        }
      }
    }, 1000);
  }

  renderer(type) {
    return this.handlers[type];
  }

  canRender(element) {
    // default elements can be handled
    if (super.canRender(element)) {
      return true;
    }

    // QuantME elements can be handled
    for (var i = 0; i < quantmeReplaceOptions.TASK.length; i++) {
      if (element.type === quantmeReplaceOptions.TASK[i].target.type) {
        return true;
      }
    }

    console.log("Unable to render element of type: " + element.type);
    return false;
  }

  drawHardwareSelectionSubprocess(parentGfx,quantMEPathMap, element, subprocess){
    var pathData = quantMEPathMap.getPath(
      "SUBPROCESS_QUANTUM_HARDWARE_SELECTION"
    );
    drawPath(parentGfx, pathData, {
      transform: "scale(0.5)",
      strokeWidth: 1.5,
      fill: getFillColor(element, defaultFillColor),
      stroke: getStrokeColor(element, defaultStrokeColor),
    });

    // create circuit paths with filled shapes
    pathData = quantMEPathMap.getPath(
      "SUBPROCESS_QUANTUM_HARDWARE_SELECTION_FILL"
    );
    drawPath(parentGfx, pathData, {
      transform: "scale(0.5)",
      strokeWidth: 1.5,
      fill: getFillColor(element, "#000000"),
      stroke: getStrokeColor(element, defaultStrokeColor),
    });
    console.log(subprocess)

    return subprocess;

  }

  addOverlay(parentGfx, element, bpmnRenderer) {


    let groupDef = svgCreate('g');
    
    svgAppend(parentGfx, svgCreate("path", {
      d: "M -260 -110 L 360 -110 L 360 -10   L 55 -10   L 50 -5  L 45 -10  L -260 -10 Z",
      fill: "white",
      stroke: "#777777",
      "pointer-events": "all"
  }));
    svgAttr(groupDef, {transform: `matrix(1, 0, 0, 1, ${-238}, ${-78})`});

}

  drawShape(parentNode, element) {
    // handle QuantME elements
    if (element.type in this.quantMeHandlers) {
      var h = this.quantMeHandlers[element.type];

      /* jshint -W040 */
      return h(this, parentNode, element);
    }

    // use parent class for all non QuantME elements
    return super.drawShape(parentNode, element);
  }
}

QuantMERenderer.$inject = [
  "eventBus",
  "styles",
  "bpmnRenderer",
  "textRenderer",
  "canvas",
];
