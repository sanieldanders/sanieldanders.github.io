import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { SupabaseAuthService } from '../services/supabase-auth.service';

export const requireAuthGuard: CanActivateChildFn = async () => {
  const auth = inject(SupabaseAuthService);
  const router = inject(Router);
  await auth.init();
  return auth.isSignedIn() ? true : router.parseUrl('/login');
};

export const redirectSignedInFromLoginGuard: CanActivateFn = async () => {
  const auth = inject(SupabaseAuthService);
  const router = inject(Router);
  await auth.init();
  return auth.isSignedIn() ? router.parseUrl('/home') : true;
};
