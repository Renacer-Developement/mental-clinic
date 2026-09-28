import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  loadTests,
  loadTestsSuccess,
  loadTestsFailure,
} from './test.actions';
import { catchError, map, mergeMap, of } from 'rxjs';
import {TestService} from '../../features/tests/services/test.service';

@Injectable()
export class TestEffects {
  constructor(private actions$: Actions, private testService: TestService) {}

  loadTests$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadTests),
      mergeMap(() =>
        this.testService.getTests().pipe(
          map((tests) => loadTestsSuccess({ tests })),
          catchError((error) => of(loadTestsFailure({ error: error.message })))
        )
      )
    )
  );
}
