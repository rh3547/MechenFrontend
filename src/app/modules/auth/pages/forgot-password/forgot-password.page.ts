import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProxy, AlertService } from '@ng-nuc/core';
import { GlobalVars } from '@services';
import { Api } from '@services';
import { Routes } from '@app/app-routes';

@Component({
  selector: 'forgot-password-page',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit, OnDestroy {

	public submitted: boolean = false;
  private routeSub: Subscription;
	public forgotPasswordForm: FormGroup;

  constructor(
    private activatedRoute: ActivatedRoute,
    public globalVars: GlobalVars,
    private api: Api,
		private alertService: AlertService,
		private fb: FormBuilder,
		private authProxy: AuthProxy,
		public router: Router
  ) {
		this.routeSub = this.activatedRoute.params.subscribe(val => {
			this.globalVars.showPageLoader();
			this.loadPage();
		});
  }

  ngOnInit() {
		this.submitted = false;
		this.forgotPasswordForm = this.fb.group(
			{
				email: ['', [Validators.required, Validators.email]],
			}
		)
  }

  ngOnDestroy() {
		this.routeSub.unsubscribe();
	}

  private loadPage() {
		if (this.forgotPasswordForm) {
			this.forgotPasswordForm.reset();
		}

		this.globalVars.hidePageLoader();
		this.submitted = false;
	}

	public forgotPassword() {
		Object.keys(this.forgotPasswordForm.controls).forEach(controlName => {
			this.forgotPasswordForm.get(controlName).markAsDirty();
		});

		if (this.forgotPasswordForm.valid) {
			var authData = {
				email: this.forgotPasswordForm.get('email').value,
			};

			this.alertService.toast("If an account with the email " + this.forgotPasswordForm.get('email').value + " exists, you will receive an email with instructions to complete your forgotten password");

			this.authProxy.forgotPassword(authData).then((res) => {
				authData = null;
			},
				err => {
					this.alertService.toastError("Something went wrong. Please try again.", "Error");
					console.error("Login Error:", err);
				});
		}
	}

	public backToLogin() {
		this.router.navigate([Routes.Auth.Login]);
	}
}
