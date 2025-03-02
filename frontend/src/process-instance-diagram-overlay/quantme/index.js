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

import CustomRenderer from './CustomRenderer';
import QuantMEPathMap from './QuantMEPathMap';

export default {
  __init__: ['customRenderer', 'quantMEPathMap'],
  customRenderer: ['type', CustomRenderer],
  quantMEPathMap: ['type', QuantMEPathMap],
};
