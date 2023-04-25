/*
 *
 * RiskAi reducer
 *
 */
import produce from 'immer';
import * as constants from './constants';

export const initialState = {};

/* eslint-disable default-case, no-param-reassign */
const riskAiReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case constants.DEFAULT_ACTION:
        break;
      case constants.GET_PRODUCTS_SUCCESS:
        draft.products = action.response;
        break;
      case constants.GET_INFO_SUCCESS:
        draft.userInfo = action.response;
        break;
    }
  });

export default riskAiReducer;
