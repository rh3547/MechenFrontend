import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthProxy, LogoutMethod, AlertService, UserService } from '@ng-nuc/core';
import { Routes } from '@routes';

@Component({
	selector: 'sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

	constructor(
		public router: Router,
		public userService: UserService,
		private authProxy: AuthProxy,
		private alertService: AlertService
	) { }

	ngOnInit() {

	}

	public logout() {
		setTimeout(() => {
			this.authProxy.logout(LogoutMethod.UserInitiated);
			this.router.navigate([`/${Routes.Auth.Login}`]);
		}, 100);
	}
}
