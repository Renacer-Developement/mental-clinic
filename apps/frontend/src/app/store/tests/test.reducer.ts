import { createReducer, on } from '@ngrx/store';
import {
  loadTests,
  loadTestsSuccess,
  loadTestsFailure,
} from './test.actions';
import {Test} from '../../features/tests/models/test.model';

export interface TestState {
  tests: Test[];
  loading: boolean;
  error: string | null;
}

export const initialState: TestState = {
  tests: [],
  loading: false,
  error: null,
};

export const testReducer = createReducer(
  initialState,
  on(loadTests, (state) => ({ ...state, loading: true })),
  on(loadTestsSuccess, (state, { tests }) => ({
    ...state,
    tests,
    loading: false,
  })),
  on(loadTestsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
