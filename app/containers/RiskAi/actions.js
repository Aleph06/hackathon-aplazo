/*
 *
 * RiskAi actions
 *
 */

import * as constants from './constants';

export function defaultAction() {
  return {
    type: constants.DEFAULT_ACTION,
  };
}

export function getProducts(text) {
  return {
    type: constants.GET_PRODUCTS_INIT,
    text,
  };
}

export function getInfo(email) {
  return {
    type: constants.GET_INFO_INIT,
    email,
  };
}
