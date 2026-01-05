import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const encargadoGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const auth: AuthService = inject(AuthService);
  if (auth.getUser()?.rolDescription !== "Supervisor") {
    router.navigate(['/auth'])
    return false;
  } else {
    return true;
  }
};
