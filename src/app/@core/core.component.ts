import { AfterViewInit, Component, OnInit } from '@angular/core';
import { GlobalVars, ThemeService } from '@services';
import { AuthProxy, LogoutMethod, AlertService, AlertPosition } from '@ng-nuc/core';
import { OpenIddictService } from '@ng-nuc/auth-openiddict';
import { environment } from '@environments/environment';
import { Router } from '@angular/router';
import { Routes } from '@routes';
import { CognitoService } from '@ng-nuc/auth-cognito';
import { NgxSmartModalComponent, NgxSmartModalService } from 'ngx-smart-modal';
import { ChangelogModal } from '@shared/components/modals/changelog-modal/changelog-modal.modal';
import { DeckService } from '@app/@core/services/deck.service';

@Component({
	selector: 'app-root',
	templateUrl: './core.component.html',
	styleUrls: ['./core.component.scss']
})
export class CoreComponent implements OnInit, AfterViewInit {

	constructor(
		private themeService: ThemeService,
		public globalVars: GlobalVars,
		private authProxy: AuthProxy,
		private alertService: AlertService,
		private router: Router,
		private modalService: NgxSmartModalService,

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

	ngAfterViewInit() {
		let lastChangelogSeen = window.localStorage.getItem("lastChangelogSeen");
		if (!lastChangelogSeen || lastChangelogSeen != this.globalVars.appVersion) {
			this.showChangelogModal();
		}
	}

	showChangelogModal() {
		// Present the modal
		var modal = this.modalService.create('changelogModal', ChangelogModal, { closable: false, dismissable: false, customClass: "changelog-modal" }).open();

		// Set the modal data
		modal.setData({
			modalId: 'changelogModal'
		});

		// Respond to the modal closing
		modal.onAnyCloseEventFinished.subscribe((modal: NgxSmartModalComponent) => {
			var data = modal.getData();

			// Ok
			if (data.closeType == "confirm") {
				window.localStorage.setItem("lastChangelogSeen", this.globalVars.appVersion);
			}

			this.modalService.removeModal('changelogModal');
		});
	}
}
