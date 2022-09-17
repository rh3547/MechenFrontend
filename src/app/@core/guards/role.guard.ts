import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Routes } from '@routes';
import { GlobalVars } from '../services';
import { UserHelperService } from '@core/services/user-helper.service';

@Injectable({
	providedIn: 'root',
})
export class RoleGuard implements CanActivate {
	constructor(
		private router: Router,
		public globalVars: GlobalVars,
		private userService: UserHelperService
	) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
		return new Promise((resolve, reject) => {
			let allowedRoles = route.data.allowedRoles as Array<string>;

			this.findRole(allowedRoles).then(
				(roleFound) => {
					if (roleFound) {
						resolve(true);
					}
					else {
						resolve(this.router.parseUrl('/401'));
					}
				}
			);
		})
	}

	private findRole(roleNames: string[]): Promise<any> {
		return new Promise((resolve) => {
			let roles = this.globalVars.getUserRoles();
			if (roles?.length > 0) {
				roleNames.forEach((role) => {
					if (roles.find(x => x.toUpperCase() === role.toUpperCase())) {
						resolve(true);
					}
				});
				resolve(false);
			}
			else {
				this.userService.getUser().then((user) => {
					this.globalVars.getApiUserRoles(user.id).then((userRoles) => {
						var roles = userRoles;
						roleNames.forEach((role) => {
							if (roles.find(x => x.toUpperCase() === role.toUpperCase())) {
								resolve(true);
							}
						});
						resolve(false);
					});
				});
			}
		});
	}
}
