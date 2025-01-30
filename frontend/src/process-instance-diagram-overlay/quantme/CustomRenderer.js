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
import * as patternReplaceOptions from "./pattern/PatternReplaceOptions";
import { getPatternSVG } from "./pattern/PatternSVGMap";
import * as consts from "./Constants";
import * as patternConsts from "./pattern/Constants";
import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
  innerSVG,
  select as svgSelect,
  selectAll as svgSelectAll,
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
      if (element.type === "bpmn:BoundaryEvent") {
        if (type === 'render.shape') {
          let task = bpmnRenderer.drawShape(parentGfx, element);
          let attrs = element.businessObject.$attrs;
          console.log(element);
          console.log(attrs);
          if (attrs !== undefined) {
            let type = attrs["pattern:patternType"];
            if (type !== undefined) {
              drawPatternSVG(parentGfx, type, null, true);
            }
            return task;
          }
        }
      }

      if (element.type === "bpmn:Task" || element.type === "bpmn:SubProcess") {
        if (type === 'render.shape') {
          let task = bpmnRenderer.drawShape(parentGfx, element);
          let attrs = element.businessObject.$attrs;
          if (attrs !== undefined) {
            let type = attrs["quantme:quantmeTaskType"];
            if (type !== undefined) {
              drawTaskSVG(parentGfx, type, null, true);
            }
            return task;
          }
        }
      }

      if (element.type === "bpmn:DataObjectReference") {
        if (type === 'render.shape') {
          let task = bpmnRenderer.drawShape(parentGfx, element);
          let attrs = element.businessObject.$attrs;
          if (attrs !== undefined) {
            let type = attrs["quantme:quantmeTaskType"];
            if (type !== undefined) {
              drawDataObjectSVG(parentGfx, type, null, true);
            }
            return task;
          }
        }
      }

    });

    let computeStyle = styles.computeStyle;

    let defaultFillColor = "white",
      defaultStrokeColor = "white";
    

    function drawPatternSVG(parentGfx, iconID, svgAttributes, foreground) {
      let importsvg = getPatternSVG(iconID);
      let innerSVGstring = importsvg.svg;
      let transformDef = importsvg.transform;

      const groupDef = svgCreate("g");
      svgAttr(groupDef, { transform: transformDef });
      innerSVG(groupDef, innerSVGstring);
      console.log(parentGfx);

      // Select all <circle> elements within parentGfx and hide them
      const circles = svgSelectAll(parentGfx, "circle");
      circles.forEach(circle => {
        svgAttr(circle, { "display": "none" });
      });

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

    function drawTaskSVG(parentGfx, iconID, svgAttributes, foreground) {
      let importsvg = getQuantMESVG(iconID);
      let innerSVGstring = importsvg.svg;
      let transformDef = importsvg.transform;

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

    this.customHandler = {
      [consts.QUANTUM_HARDWARE_SELECTION_SUBPROCESS]: function (
        self,
        parentGfx,
        element
      ) {
        let subprocess = self.renderer("bpmn:SubProcess")(parentGfx, element);

        let pathData = quantMEPathMap.getPath(
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
        let subprocess = self.renderer("bpmn:SubProcess")(parentGfx, element);
        drawTaskSVG(parentGfx, "SUBPROCESS_TYPE_CIRCUIT_CUTTING");
        return subprocess;
      },
      [consts.CIRCUIT_CUTTING_TASK]: function (self, parentGfx, element) {
        let task = self.renderer("bpmn:Task")(parentGfx, element);
        drawTaskSVG(parentGfx, "SUBPROCESS_TYPE_CIRCUIT_CUTTING");
        return task;
      },
      [consts.CUTTING_RESULT_COMBINATION_TASK]: function (
        self,
        parentGfx,
        element
      ) {
        let task = self.renderer("bpmn:Task")(parentGfx, element);
        drawTaskSVG(parentGfx, "TASK_TYPE_RESULT_COMBINATION");
        return task;
      },
      [consts.QUANTUM_COMPUTATION_TASK]: function (self, parentGfx, element) {
        let task = self.renderer("bpmn:Task")(parentGfx, element);

        let pathData = quantMEPathMap.getPath("TASK_TYPE_QUANTUM_COMPUTATION");

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
        let task = self.renderer("bpmn:Task")(parentGfx, element);

        // create circuit paths without filled shapes
        let pathData = quantMEPathMap.getPath("TASK_TYPE_CIRCUIT_LOADING");
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
        let task = self.renderer("bpmn:Task")(parentGfx, element);

        let pathData = quantMEPathMap.getPath("TASK_TYPE_DATA_PREPARATION");
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
        let task = self.renderer("bpmn:Task")(parentGfx, element);

        let pathData = quantMEPathMap.getPath("TASK_TYPE_ORACLE_EXPANSION");
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
        let task = self.renderer("bpmn:Task")(parentGfx, element);

        let pathData = quantMEPathMap.getPath("TASK_TYPE_CIRCUIT_EXECUTION");
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
      [patternConsts.QUANTUM_KERNEL_ESTIMATOR]: function (self, parentGfx, element) {
        let attrs = {
          fill: "none",
          stroke: "none",
        };
        element.width = 43;
        element.height = 43;
        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawPatternSVG(parentGfx, "QUANTUM_KERNEL_ESTIMATOR");
        return task;
      },
      [patternConsts.ALTERNATING_OPERATOR_ANSATZ]: function (
        self,
        parentGfx,
        element
      ) {
        let attrs = {
          fill: "none",
          stroke: "none",
        };
        element.width = 43;
        element.height = 43;
        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawPatternSVG(parentGfx, "ALTERNATING_OPERATOR_ANSATZ");
        return task;
      },
      [patternConsts.QUANTUM_APPROXIMATE_OPTIMIZATION_ALGORITHM]: function (
        self,
        parentGfx,
        element
      ) {
        let attrs = {
          fill: "none",
          stroke: "none",
        };
        element.width = 43;
        element.height = 43;
        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawPatternSVG(parentGfx, "QUANTUM_APPROXIMATE_OPTIMIZATION_ALGORITHM");
        return task;
      },
      [patternConsts.QUANTUM_PHASE_ESTIMATION]: function (self, parentGfx, element) {
        let attrs = {
          fill: "none",
          stroke: "none",
        };
        element.width = 43;
        element.height = 43;
        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawPatternSVG(parentGfx, "QUANTUM_PHASE_ESTIMATION");
        return task;
      },
      [patternConsts.VARIATIONAL_QUANTUM_ALGORITHM]: function (
        self,
        parentGfx,
        element
      ) {
        let attrs = {
          fill: "none",
          stroke: "none",
        };
        element.width = 43;
        element.height = 43;
        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawPatternSVG(parentGfx, "VARIATIONAL_QUANTUM_ALGORITHM");
        return task;
      },
      [patternConsts.VARIATIONAL_QUANTUM_EIGENSOLVER]: function (
        self,
        parentGfx,
        element
      ) {
        let attrs = {
          fill: "none",
          stroke: "none",
        };
        element.width = 43;
        element.height = 43;
        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawPatternSVG(parentGfx, "VARIATIONAL_QUANTUM_EIGENSOLVER");
        return task;
      },
      [patternConsts.ORCHESTRATED_EXECUTION]: function (self, parentGfx, element) {
        let attrs = {
          fill: "none",
          stroke: "none",
        };
        element.width = 43;
        element.height = 43;
        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawPatternSVG(parentGfx, "ORCHESTRATED_EXECUTION");
        return task;
      },
      [patternConsts.PRE_DEPLOYED_EXECUTION]: function (self, parentGfx, element) {
        let attrs = {
          fill: "none",
          stroke: "none",
        };
        element.width = 43;
        element.height = 43;
        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawPatternSVG(parentGfx, "PRE_DEPLOYED_EXECUTION");
        return task;
      },
      [patternConsts.PRIORITIZED_EXECUTION]: function (self, parentGfx, element) {
        let attrs = {
          fill: "none",
          stroke: "none",
        };
        element.width = 43;
        element.height = 43;
        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawPatternSVG(parentGfx, "PRIORITIZED_EXECUTION");
        return task;
      },
      [patternConsts.ERROR_CORRECTION]: function (self, parentGfx, element) {
        let attrs = {
          fill: "none",
          stroke: "none",
        };
        element.width = 43;
        element.height = 43;
        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawPatternSVG(parentGfx, "ERROR_CORRECTION");
        return task;
      },
      [patternConsts.READOUT_ERROR_MITIGATION]: function (self, parentGfx, element) {
        let attrs = {
          fill: "none",
          stroke: "none",
        };
        element.width = 43;
        element.height = 43;
        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawPatternSVG(parentGfx, "READOUT_ERROR_MITIGATION");
        return task;
      },
      [patternConsts.GATE_ERROR_MITIGATION]: function (self, parentGfx, element) {
        let attrs = {
          fill: "none",
          stroke: "none",
        };
        console.log(parentGfx);
        element.width = 43;
        element.height = 43;

        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawPatternSVG(parentGfx, "GATE_ERROR_MITIGATION");
        return task;
      },
      [patternConsts.BIASED_INITIAL_STATE]: function (self, parentGfx, element) {
        let attrs = {
          fill: "none",
          stroke: "none",
        };
        element.width = 43;
        element.height = 43;
        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawPatternSVG(parentGfx, "BIASED_INITIAL_STATE");
        return task;
      },
      [patternConsts.PRE_TRAINED_FEATURE_EXTRACTOR]: function (
        self,
        parentGfx,
        element
      ) {
        let attrs = {
          fill: "none",
          stroke: "none",
        };
        element.width = 43;
        element.height = 43;
        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawPatternSVG(parentGfx, "PRE_TRAINED_FEATURE_EXTRACTOR");
        return task;
      },
      [patternConsts.CHAINED_OPTIMIZATION]: function (self, parentGfx, element) {
        let attrs = {
          fill: "none",
          stroke: "none",
        };
        element.width = 43;
        element.height = 43;
        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawPatternSVG(parentGfx, "CHAINED_OPTIMIZATION");
        return task;
      },
      [patternConsts.VARIATIONAL_PARAMETER_TRANSFER]: function (
        self,
        parentGfx,
        element
      ) {
        let attrs = {
          fill: "none",
          stroke: "none",
        };
        element.width = 43;
        element.height = 43;
        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawPatternSVG(parentGfx, "VARIATIONAL_PARAMETER_TRANSFER");
        return task;
      },
      [patternConsts.CIRCUIT_CUTTING]: function (self, parentGfx, element) {
        let attrs = {
          fill: "none",
          stroke: "none",
        };
        element.width = 44;
        element.height = 44;
        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawPatternSVG(parentGfx, "CIRCUIT_CUTTING");
        return task;
      },
      [patternConsts.QUANTUM_HARDWARE_SELECTION]: function (self, parentGfx, element) {
        let attrs = {
          fill: "none",
          stroke: "none",
        };
        element.width = 44;
        element.height = 44;
        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawPatternSVG(parentGfx, "QUANTUM_HARDWARE_SELECTION");
        return task;
      },
      [patternConsts.PATTERN]: function (self, parentGfx, element) {
        let attrs = {
          fill: "none",
          stroke: "none",
        };
        element.width = 43;
        element.height = 43;
        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawPatternSVG(parentGfx, "PATTERN");
        return task;
      },
    };

    setTimeout(function () {
      let existingDefs = domQueryAll("marker", canvas._svg);
      if (existingDefs != null) {
        let createdNewDefs = false;
        for (let i = 0; i < existingDefs.length; i++) {
          if (existingDefs[i].parentElement.parentElement.nodeName !== "svg") {
            if (createdNewDefs === false) {
              let newDefs = svgCreate("defs");
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
    for (let i = 0; i < quantmeReplaceOptions.TASK.length; i++) {
      if (element.type === quantmeReplaceOptions.TASK[i].target.type) {
        return true;
      }
    }

    // Pattern elements can be handled
    for (let i = 0; i < patternReplaceOptions.PATTERN.length; i++) {
      if (element.type === patternReplaceOptions.PATTERN[i].target.type) {
        return true;
      }
    }

    console.log("Unable to render element of type: " + element.type);
    return false;
  }

  drawShape(parentNode, element) {
    // handle QuantME elements
    if (element.type in this.customHandler) {
      let h = this.customHandler[element.type];

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
