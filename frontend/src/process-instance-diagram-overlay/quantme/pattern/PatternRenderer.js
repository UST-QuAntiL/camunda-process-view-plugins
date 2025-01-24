/**
 * Copyright (c) 2025 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */
import * as patternReplaceOptions from "./PatternReplaceOptions";
import * as patternConsts from "./Constants";
import {
  append as svgAppend,
  attr as svgAttr,
  create as svgCreate,
  innerSVG,
  select as svgSelect,
  selectAll as svgSelectAll
} from "tiny-svg";
import { getPatternSVG } from "./PatternSVGMap";
import { queryAll as domQueryAll } from "min-dom";

/**
 * This class extends the default BPMNRenderer to render the newly introduced pattern task types
 */
export default class PatternRenderer{
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
              drawTaskSVG(parentGfx, type, null, true);
            }
            return task;
          }
        }
      }


    });

    let computeStyle = styles.computeStyle;


    function drawTaskSVG(parentGfx, iconID, svgAttributes, foreground) {
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

    this.patternHandlers = {
      [patternConsts.QUANTUM_KERNEL_ESTIMATOR]: function (self, parentGfx, element) {
        let attrs = {
          fill: "none",
          stroke: "none",
        };
        element.width = 43;
        element.height = 43;
        var task = self.renderer("bpmn:Activity")(parentGfx, element, attrs);
        drawTaskSVG(parentGfx, "QUANTUM_KERNEL_ESTIMATOR");
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
        drawTaskSVG(parentGfx, "ALTERNATING_OPERATOR_ANSATZ");
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
        drawTaskSVG(parentGfx, "QUANTUM_APPROXIMATE_OPTIMIZATION_ALGORITHM");
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
        drawTaskSVG(parentGfx, "QUANTUM_PHASE_ESTIMATION");
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
        drawTaskSVG(parentGfx, "VARIATIONAL_QUANTUM_ALGORITHM");
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
        drawTaskSVG(parentGfx, "VARIATIONAL_QUANTUM_EIGENSOLVER");
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
        drawTaskSVG(parentGfx, "ORCHESTRATED_EXECUTION");
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
        drawTaskSVG(parentGfx, "PRE_DEPLOYED_EXECUTION");
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
        drawTaskSVG(parentGfx, "PRIORITIZED_EXECUTION");
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
        drawTaskSVG(parentGfx, "ERROR_CORRECTION");
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
        drawTaskSVG(parentGfx, "READOUT_ERROR_MITIGATION");
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
        drawTaskSVG(parentGfx, "GATE_ERROR_MITIGATION");
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
        drawTaskSVG(parentGfx, "BIASED_INITIAL_STATE");
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
        drawTaskSVG(parentGfx, "PRE_TRAINED_FEATURE_EXTRACTOR");
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
        drawTaskSVG(parentGfx, "CHAINED_OPTIMIZATION");
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
        drawTaskSVG(parentGfx, "VARIATIONAL_PARAMETER_TRANSFER");
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
        drawTaskSVG(parentGfx, "CIRCUIT_CUTTING");
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
        drawTaskSVG(parentGfx, "QUANTUM_HARDWARE_SELECTION");
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
        drawTaskSVG(parentGfx, "PATTERN");
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

    // Pattern elements can be handled
    for (let i = 0; i < patternReplaceOptions.PATTERN.length; i++) {
      if (element.type === patternReplaceOptions.PATTERN[i].target.type) {
        console.log("match")
        return true;
      }
    }

    console.log("Unable to render element of type: " + element.type);
    return false;
  }

  drawShape(parentNode, element) {
    // handle pattern elements
    if (element.type in this.patternHandlers) {
      let h = this.patternHandlers[element.type];

      /* jshint -W040 */
      return h(this, parentNode, element);
    }


    // use parent class for all non Pattern elements
    return super.drawShape(parentNode, element);
  }
}

PatternRenderer.$inject = [
  "eventBus",
  "styles",
  "bpmnRenderer",
  "textRenderer",
  "canvas",
];
