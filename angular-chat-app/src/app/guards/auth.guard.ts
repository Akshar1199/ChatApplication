import { CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {

  const token = !!sessionStorage.getItem("userName");

  if(token){
    return true;
  }

  return false;

};
