import { createSelector } from 'reselect';
import { initialState } from './reducer';

/**
 * Direct selector to the riskAi state domain
 */

const selectRiskAiDomain = state => state.riskAi || initialState;

/**
 * Other specific selectors
 */

/**
 * Default selector used by RiskAi
 */

const makeSelectRiskAi = () =>
  createSelector(
    selectRiskAiDomain,
    substate => substate,
  );

export default makeSelectRiskAi;
export { selectRiskAiDomain };
