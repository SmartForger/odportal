import { Injectable } from "@angular/core";
import {
  CanLoad,
  Router,
  Route
} from "@angular/router";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root"
})
export class LoginGuard implements CanLoad {
  constructor(
    private authSvc: AuthService,
    private router: Router
  ) {}

  canLoad(route: Route): boolean {
    if (this.authSvc.isLoggedIn) {
      return true;
    }
    else {
      this.router.navigateByUrl('/');
      return false;
    }
  }
}
