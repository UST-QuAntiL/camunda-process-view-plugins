/**
 * Copyright (c) 2021 Institute of Architecture of Application Systems -
 * University of Stuttgart
 *
 * This program and the accompanying materials are made available under the
 * terms the Apache Software License 2.0
 * which is available at https://www.apache.org/licenses/LICENSE-2.0.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

import QuantMERenderer from './QuantMERenderer';
import QuantMEPathMap from './QuantMEPathMap';
import QuantMEReplaceMenuProvider from './QuantMEReplaceMenuProvider'

export default {
  __init__: ['quantMERenderer', 'quantMEReplaceMenu', 'quantMEPathMap'],
  quantMERenderer: ['type', QuantMERenderer],
  quantMEReplaceMenu: ['type', QuantMEReplaceMenuProvider],
  quantMEPathMap: ['type', QuantMEPathMap],
};
