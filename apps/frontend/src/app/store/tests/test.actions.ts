import { createAction, props } from '@ngrx/store';
import {Test} from '../../features/tests/models/test.model';

export const loadTests = createAction('[Test API] Load Tests');
export const loadTestsSuccess = createAction(
  '[Test API] Load Tests Success',
  props<{ tests: Test[] }>()
);
export const loadTestsFailure = createAction(
  '[Test API] Load Tests Failure',
  props<{ error: string }>()
);

export const addTest = createAction(
  '[Test API] Add Test',
  props<{ test: Test }>()
);
export const deleteTest = createAction(
  '[Test API] Delete Test',
  props<{ id: string }>()
);
