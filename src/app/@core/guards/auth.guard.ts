import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot,
	UrlTree
} from '@angular/router';
import { Routes } from '@routes';
import { AuthProxy } from '@ng-nuc/core';

@Injectable({
	providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	constructor(
		private router: Router,
		private authProxy: AuthProxy
	) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
		return new Promise((resolve) => {
			this.authProxy.isAuthenticated().then((isAuth) => {
				if (!isAuth) {
					resolve(this.router.parseUrl(Routes.Auth.Login));
				}
				else {
					resolve(true);
				}
			});
		});
	}
}
