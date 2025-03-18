import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route:ActivatedRouteSnapshot, state) => {

  const router = inject(Router);
  const isLoggedIn = !!sessionStorage.getItem('userName');

  const routePath = route.url.map((segment) => segment.path).join('/');
  console.log('Route Path:', routePath);

  if (isLoggedIn) {

    if (routePath === 'login' || routePath === 'register') {
      alert('You are already logged in.');
      router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }

  if (routePath !== 'login' && routePath !== 'register') {
    alert('You need to log in first before accessing this page..');
    router.navigate(['/login']);
    return false;
  }

  return true;

};
