import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { User } from 'firebase/auth';
import { AuthService } from '../auth/auth.service';

export const authGuard: CanActivateFn = (): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getAuthState().pipe(
    take(1),
    map((user: User | null) => {
      if (user && user.emailVerified) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};