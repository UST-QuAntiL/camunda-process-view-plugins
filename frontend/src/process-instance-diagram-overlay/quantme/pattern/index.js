/*
 * Copyright (c) 2025 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import PatternRenderer from './PatternRenderer';
import PatternPathMap from './PatternPathMap';

export default {
  __init__: ['patternRenderer', 'patternPathMap'],
  patternRenderer: ['type', PatternRenderer],
  patternPathMap: ['type', PatternPathMap],
};
