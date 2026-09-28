import { createSelector, createFeatureSelector } from '@ngrx/store';
import {TestState} from './test.reducer';


export const selectTestState = createFeatureSelector<TestState>('test');

export const selectTests = createSelector(
  selectTestState,
  (state) => state.tests
);

export const selectLoading = createSelector(
  selectTestState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectTestState,
  (state) => state.error
);
