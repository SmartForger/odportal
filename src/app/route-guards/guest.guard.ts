import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root"
})
export class GuestGuard implements CanActivate {
  constructor(private authSvc: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    console.log("guest guard");
    console.log("is logged in", this.authSvc.isLoggedIn)
    if (this.authSvc.isLoggedIn) {
      this.router.navigate(["/dashboard"]);
    }

    return true;
  }
}
