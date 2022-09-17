import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl, PatternValidator } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GlobalVars } from '@services/global-vars.service';
import { Api } from '@services/api.service';
import { AlertService, AuthProxy } from '@ng-nuc/core';
import { equalsValidator } from '@ng-nuc/components'
import { Routes } from '@app/app-routes';

@Component({
	selector: 'nuc-account-setup',
	templateUrl: './account-setup.page.html',
	styleUrls: ['./account-setup.page.scss'],
})
export class AccountSetupPage implements OnInit, OnDestroy {

	public createPasswordForm: FormGroup;
	public submitted: boolean = false;
	private routeSub: Subscription;
	private uid: string;
	private code: string;
	public loginRoute = Routes?.Auth.Register

	public fieldPasswordType: boolean = true;
	public fieldPasswordConfirmType: boolean = true;

	constructor(
		private alertService: AlertService,
		private fb: FormBuilder,
		private authProxy: AuthProxy,
		public globalVars: GlobalVars,
		public router: Router,
		private route: ActivatedRoute,
		private api: Api,
	) {
		this.routeSub = this.route.params.subscribe(val => {
			this.loadPage();
		});
	}

	ngOnInit() {

		this.routeSub = this.route.queryParamMap.subscribe(queryParams => {
			this.uid = queryParams.get("uid");
			this.code = queryParams.get("code");
		});

		this.createPasswordForm = this.fb.group(
			{
				newPass: ['', [Validators.required]],
			}
		)

		this.createPasswordForm.addControl(
			'confirmNewPass',
			new FormControl('', [Validators.required, equalsValidator(this.createPasswordForm, "newPass")])
		);
	}

	ngOnDestroy() {
		this.routeSub.unsubscribe();
	}

	createPass() {
		this.submitted = true;

		Object.keys(this.createPasswordForm.controls).forEach(controlName => {
			this.createPasswordForm.get(controlName).markAsDirty();
		});

		if (this.createPasswordForm.valid) {
			var passData = {
				id: this.uid,
				code: this.code,
				newPassword: this.createPasswordForm.get('newPass').value
			};

			this.authProxy.changePassword(passData)
				.then((res) => {

					if (res.success == false) {
						this.alertService.displayPublicApiMessages(res);
					}
					else {
						this.alertService.toastSuccess("You successfully changed your password.", "Success");
						this.router.navigate(["/login"]).then(() => {
							passData = null;
							this.createPasswordForm.reset();
						});
					}
				},
					(err) => {
						this.alertService.toastError("Something went wrong while attempting password reset. Please try again.", "Error");
						console.error("Error calling change password from change password page:", err);
					}
				);
		}
	}

	public passwordHide() {
		this.fieldPasswordType = !this.fieldPasswordType;
	}

	public passwordConfirmHide() {
		this.fieldPasswordConfirmType = !this.fieldPasswordConfirmType;
	}

	private loadPage() {
		this.globalVars.hidePageLoader();
	}
}
