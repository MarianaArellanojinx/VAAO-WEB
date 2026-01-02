import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

export const adminGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const auth: AuthService = inject(AuthService);
  if(auth.getUser()?.rolDescription !== "Admin"){
    router.navigate(['/auth'])
    return false;
  }else {
    return true;
  }
};
