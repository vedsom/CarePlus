import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../patient/services/auth.service';
import { jwtDecode } from 'jwt-decode';

export const RoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getToken();
  if (!token) {
    router.navigate(['/auth/login']);
    return false;
  }

  const decoded: any = jwtDecode(token);
  if (decoded.role !== route.data['role']) {
    router.navigate(['/auth/login']);
    return false;
  }

  return true;
};
