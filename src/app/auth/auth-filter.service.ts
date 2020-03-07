import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

@Injectable()
export class AuthFilter {
  constructor(private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log(state);
    if (Cookie.get('authToken') === undefined || Cookie.get('authToken') === '' || Cookie.get('authToken') == null) {
      console.log(Cookie.get('authToken'));
      return true;
    } else {
      console.log(Cookie.get('authToken'));
      this.router.navigate([`/dashboard/${Cookie.get('receiverId')}`]);
      return true;
    }
  }
}
