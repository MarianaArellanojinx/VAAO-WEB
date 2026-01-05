import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const encargadoAdminGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const auth: AuthService = inject(AuthService);
  if (auth.getUser()?.rolDescription === "Admin" || auth.getUser()?.rolDescription === "Supervisor") {
    return true;
  } else {
    router.navigate(['/auth'])
    return false;
  }
};
