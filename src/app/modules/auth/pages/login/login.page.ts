import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthProxy, ApiResponse, AlertService } from '@ng-nuc/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Routes } from '@app/app-routes';
import { GlobalVars } from '@services';
import { Api } from '@services';

@Component({
	selector: 'login-page',
	templateUrl: './login.page.html',
	styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {

	public submitted: boolean = false;
	public loginForm: FormGroup;
	private routeSub: Subscription;
	public hidePassword: boolean = true;

	constructor(
		private activatedRoute: ActivatedRoute,
		public globalVars: GlobalVars,
		private api: Api,
		public router: Router,
		private alertService: AlertService,
		private authProxy: AuthProxy,
		private fb: FormBuilder
	) {
		this.routeSub = this.activatedRoute.params.subscribe(val => {
			this.globalVars.showPageLoader();
			this.loadPage();
		});
	}

	ngOnInit() {
		this.submitted = false;
		this.loginForm = this.fb.group(
			{
				username: ['admin@nucleus.com', [Validators.required, Validators.email]],
				password: ['P@ssword1', [Validators.required]]
			}
		)
	}

	ngOnDestroy() {
		this.routeSub.unsubscribe();
	}

	private loadPage() {
		if (this.loginForm) {
			this.loginForm.reset();
		}

		this.globalVars.hidePageLoader();
		this.submitted = false;
	}

	public login() {
		this.submitted = true;

		Object.keys(this.loginForm.controls).forEach(controlName => {
			this.loginForm.get(controlName).markAsDirty();
		});

		if (this.loginForm.valid) {
			this.globalVars.setUserRoles([]);

			var authData = {
				username: this.loginForm.get('username').value,
				password: this.loginForm.get('password').value
			};

			this.globalVars.showPageLoader();
			this.authProxy
				.authenticate(authData)
				.then(
					(res) => {
						if (res instanceof ApiResponse && res.success == false) {
							this.alertService.displayPublicApiMessages(res);
							this.globalVars.hidePageLoader();
						}
						else {
							authData = null;
							this.router.navigate([Routes.Users.UsersResults]);
						}
					},
					(err) => {
						this.globalVars.hidePageLoader();
						this.alertService.toastError("There was a problem logging in. Please try again.", "Login Error");
						console.error("Login Error:", err);
					}
				);
		}
	}

	public goToForgotPassword() {
		this.router.navigate([Routes.Auth.ForgotPassword]);
	}
}
