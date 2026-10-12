import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { canSeeFeedback } from '../models/user.model';

/** «Заявки»: admins, and users an admin granted access to doctor and/or psychologist requests. */
export const feedbackGuard: CanActivateFn = () =>
  canSeeFeedback(inject(AuthService).currentUser()) ? true : inject(Router).createUrlTree(['/dashboard']);
