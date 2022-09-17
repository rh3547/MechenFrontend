import { Component, OnInit } from '@angular/core';
import { GlobalVars, ThemeService } from '@services';
import { AuthProxy, LogoutMethod, AlertService, AlertPosition } from '@ng-nuc/core';
import { OpenIddictService } from '@ng-nuc/auth-openiddict';
import { environment } from '@environments/environment';
import { Router } from '@angular/router';
import { Routes } from '@routes';
import { CognitoService } from '@ng-nuc/auth-cognito';

@Component({
	selector: 'app-root',
	templateUrl: './core.component.html',
	styleUrls: ['./core.component.scss']
})
export class CoreComponent implements OnInit {

	constructor(
		private themeService: ThemeService,
		public globalVars: GlobalVars,
		private authProxy: AuthProxy,
		private alertService: AlertService,
		private router: Router,

		// Choose an auth subject
		private authSubject: OpenIddictService // npm install @ng-nuc/auth-openiddict
		// private authSubject: CognitoService // npm install @ng-nuc/auth-cognito
		//private authSubject: OktaService // npm install @ng-nuc/auth-okta
	) {
		this.authProxy.setAuthConfig({
			api_url_base: environment.apiUrl,
			api_url_extension: environment.apiUrlExtension,

			// Keep for OpenIddict auth
			// grant_type: environment.oiGrantType,
			// scope: environment.oiScope,
			// client_id: environment.oiClientId,
			// grant_type_refresh: environment.oiGrantTypeRefresh,
			// sessionRenewalNotificationThresholdInMinutes: environment.sessionRenewalNotificationThresholdInMinutes,
			// token_endpoint: environment.token_endpoint,
			// revoke_endpoint: environment.revoke_endpoint,
			// refresh_endpoint: environment.refresh_endpoint

			// Keep for Cognito auth
			// user_pool_id: environment.user_pool_id,
			// app_client_id: environment.app_client_id,
			// region: environment.region
		});

		this.authProxy.setAuthInterceptorBlacklist([
			// Keep for OpenIddict auth
			// "Auth/token",
			// "Auth/Register",
			// "Auth/ForgotPassword",
			// "Auth/ResetPassword",
			// "Auth/revoke"
		]);

		this.authProxy.setAuthSubject(this.authSubject);
		this.authProxy.init();
		this.authProxy.loadSession()

		this.alertService.setGlobalPosition(AlertPosition.TOP_RIGHT);
		this.alertService.setGlobalConfirmBackdrop(true);
		this.alertService.setGlobalTarget(".app-wrapper");
		this.alertService.setGlobalConfirmAsModal(true);

		this.authSubject._logoutEvent.subscribe(
			(logoutTriggered: LogoutMethod) => {
				this.globalVars.setUserRoles([]);
				switch (logoutTriggered) {
					case LogoutMethod.SessionExpired:
						this.alertService.toastError(
							"Your session has timed out. Please login again."
						);
						this.globalVars.showPageLoader();
						this.router.navigate([Routes.Auth.Login]);
						break;
					case LogoutMethod.UserInitiated:
						this.alertService.toastSuccess(
							"You have been logged out successfully."
						);
						this.globalVars.showPageLoader();
						this.router.navigate([Routes.Auth.Login]);
						break;
					case LogoutMethod.Unauthorized:
						this.alertService.toastError(
							"You attempted to access an unauthorized resource. Your session has been ended. Please login again."
						);
						break;
				}
			}
		);
	}

	ngOnInit() {
		this.themeService.init();
	}
}
