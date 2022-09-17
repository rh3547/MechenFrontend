import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthProxy, ApiResponse, AlertService } from '@ng-nuc/core';
import { debounceTime, distinctUntilChanged } from 'rxjs/internal/operators';
import { Subscription, Subject } from 'rxjs';

import { GlobalVars } from '@services';
import { Api } from '@services';
import { NgnSelectOption } from '@ng-nuc/components';
import { AppUserAdd } from '@app/@shared/models/AppUser.model';
import * as moment from 'moment';
@Component({
	selector: 'register-page',
	templateUrl: './register.page.html',
	styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit, OnDestroy {

	private routeSub: Subscription;
	public submitted: boolean = false;
	public form: FormGroup;
	public emailChanged: Subject<string> = new Subject<string>();
	public countryChanged: Subject<string> = new Subject<string>();
	public usernameUnique: boolean = false;

	public countryOptions: NgnSelectOption[] = [];
	public stateOptions: NgnSelectOption[] = [];
	public checkingUserName: boolean = false;
	public registrationCompleted: boolean = false;
	public hideStateSelect: boolean = false;

	constructor(
		private activatedRoute: ActivatedRoute,
		public router: Router,
		private alertService: AlertService,
		private authProxy: AuthProxy,
		private fb: FormBuilder,
		private api: Api,
		private globalVars: GlobalVars
	) {
		this.routeSub = this.activatedRoute.params.subscribe(val => {
			this.loadPage();
		});
	}

	ngOnInit() {
		this.submitted = false;

		this.form = this.fb.group(
			{
				firstName: ['', [Validators.required, Validators.pattern(this.globalVars.nameRegex)]],
				lastName: ['', [Validators.required, Validators.pattern(this.globalVars.nameRegex)]],
				email: ['', [Validators.required, Validators.email]],
				phoneNumber: ['', [Validators.required, Validators.pattern(this.globalVars.phoneRegex)]],
				countryId: ['', [Validators.required]],
				stateId: [null, [Validators.required]],
				city: ['', [Validators.required, Validators.pattern(this.globalVars.defaultTextRegex)]],
				address1: ['', [Validators.required, Validators.pattern(this.globalVars.defaultTextRegex)]],
				address2: ['', [Validators.pattern(this.globalVars.defaultTextRegex)]],
				zipCode: ['', [Validators.required, Validators.pattern(this.globalVars.zipcodeRegex)]],
				otherState: [null, [Validators.required]]
			}
		);

		this.emailChanged.pipe(debounceTime(1000), distinctUntilChanged()).subscribe((changes) => {
			this.onEmailChange(changes);
		});

		this.countryChanged.pipe(debounceTime(300), distinctUntilChanged()).subscribe((changes) => {
			this.onCountryChange(changes);
		});

		this.form.controls.email.valueChanges.subscribe((changes) => {
			this.usernameUnique = false;
			this.emailChanged.next(changes);
		});

		this.form.controls.countryId.valueChanges.subscribe((changes) => {
			this.countryChanged.next(changes);
		});
	}

	ngOnDestroy() {
		this.routeSub.unsubscribe();
	}

	private loadPage() {
		this.populateDropdowns();
		this.globalVars.hidePageLoader();
	}

	private onEmailChange(changes?) {
		if (this.form.controls.email.valid) {
			this.checkingUserName = true;
			this.api.AppUser.get(`UniqueUsername/${this.form.controls.email.value}`).subscribe((res) => {
				if (res.success) {
					this.usernameUnique = true;
					this.checkingUserName = false;
				}
			},
				(err) => {
					this.checkingUserName = false;
					this.usernameUnique = false;
				});
		}
	}

	private onCountryChange(changes?) {
		var countrySelected = this.countryOptions.find(x => x.value == this.form.controls.countryId.value);
		if (countrySelected.name == "USA") {
			this.hideStateSelect = false;
			this.addRequiredValidator("stateId");
			this.removeRequiredValidator("otherState");
		}
		else {
			this.hideStateSelect = true;
			this.addRequiredValidator("otherState");
			this.removeRequiredValidator("stateId");
		}
	}

	private populateDropdowns() {
		this.api.State.search({}).subscribe((res) => {
			if (res.payload != null) {
				this.stateOptions = NgnSelectOption.mapArrayFrom(res.payload, "id", "description", null);
			}
		},
			(err) => {
				console.error(err);
			});

		this.api.Country.search({}).subscribe((res) => {
			if (res.payload != null) {
				this.countryOptions = NgnSelectOption.mapArrayFrom(res.payload, "id", "name", null);
			}
		},
			(err) => {
				console.error(err);
			});
	}

	public register() {
		this.submitted = true;
		Object.keys(this.form.controls).forEach(key => {
			this.form.get(key).markAsDirty();
		});

		if (this.form.valid) {
			var newRecord = new AppUserAdd(this.form.value);
			newRecord.isNewUser = true;
			newRecord.isActive = true;
			newRecord.isDeleted = false;
			newRecord.sendRegistrationEmail = true;

			this.api.AppUser.suppressMessages().post("TrialRegistration", newRecord).subscribe((res) => {
				if (res.success) {
					this.registrationCompleted = true;
				}
			},
				(err) => {
					console.error(err);
				});
		}
	}

	private removeRequiredValidator(controlName: string) {
		this.form.get(controlName).setValidators([]);
		this.form.get(controlName).updateValueAndValidity();
	}

	private addRequiredValidator(controlName: string) {
		this.form.get(controlName).setValidators([Validators.required]);
		this.form.get(controlName).updateValueAndValidity();
	}
}
