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
	selector: 'nuc-recover-password',
	templateUrl: './recover-password.page.html',
	styleUrls: ['./recover-password.page.scss'],
})
export class RecoverPasswordPage implements OnInit, OnDestroy {

	public form: FormGroup;
	public submitted: boolean = false;
	private routeSub: Subscription;
	private uid: string;
	private code: string;
	public loginRoute = Routes?.Auth.Login

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
		this.routeSub = this.route.queryParamMap.subscribe(queryParams => {
			this.uid = queryParams.get("uid");
			this.code = queryParams.get("code");
			this.loadPage();
		});
	}

	ngOnInit() {
		this.form = this.fb.group(
			{
				newPass: ['', [Validators.required]],
			}
		)

		this.form.addControl(
			'confirmNewPass',
			new FormControl('', [Validators.required, equalsValidator(this.form, "newPass")])
		);
	}

	ngOnDestroy() {
		this.routeSub.unsubscribe();
	}

	private loadPage() {
		if (this.form) {
			this.form.reset();
		}

		this.globalVars.hidePageLoader();
		this.submitted = false;
	}

	public submit() {
		this.submitted = true;

		Object.keys(this.form.controls).forEach(controlName => {
			this.form.get(controlName).markAsDirty();
		});

		if (this.form.valid) {
			var passData = {
				id: this.uid,
				code: this.code,
				newPassword: this.form.get('newPass').value
			};

			this.authProxy.changePassword(passData)
				.then((res) => {
					if (res.success == false) {
						this.alertService.displayPublicApiMessages(res);
						this.alertService.toastError("Something went wrong while attempting password reset. Please try again.", "Error");
					}
					else {
						this.alertService.toastSuccess("You successfully changed your password.", "Success");
						this.router.navigateByUrl(`/${Routes.Auth.Login}`).then(() => {
							passData = null;
							this.form.reset();
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
}
