import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Api } from '@services/api.service';
import { NgxSmartModalService, NgxSmartModalComponent } from "ngx-smart-modal";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GlobalVars } from '@services/global-vars.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Routes, resolveRouteParams, RouteParts } from '@app/app-routes';
import { Card } from '@models';
import { NgnSelectOption } from '@ng-nuc/components';
import { CardVersion } from '@app/@shared/models/CardVersion.model';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';
import { AlertService } from '@ng-nuc/core';

@Component({
	selector: 'card-create-page',
	templateUrl: './card-create.page.html',
	styleUrls: ['./card-create.page.scss'],
})
export class CardCreatePage implements OnInit, OnDestroy, AfterViewInit {
	private routeSub: Subscription;
	public routeParts = RouteParts;
	public routes = Routes;

	public editMode = false;
	public cardId: number;
	public card: Card;
	public cardVersion: CardVersion;

	public submitted: boolean = false;
	public formGroup: FormGroup;
	public formSub: Subscription;
	public cardTypeOptions: NgnSelectOption[] = this.globalVars.cardTypeOptions;
	public cardRarityOptions: NgnSelectOption[] = this.globalVars.cardRarityOptions;
	public cardDirectionOptions: NgnSelectOption[] = this.globalVars.cardDirectionOptions;
	public cardAreaOfEffectOptions: NgnSelectOption[] = this.globalVars.cardAreaOfEffectOptions;

	public cardPreview: Card = new Card();
	public cardVersionPreview: CardVersion = new CardVersion();

	constructor(
		private api: Api,
		private fb: FormBuilder,
		public globalVars: GlobalVars,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private modalService: NgxSmartModalService,
		private alertService: AlertService
	) {
		this.formGroup = this.fb.group({
			name: ["", [Validators.required]],
			rarity: ["", [Validators.required]],
			type: ["", [Validators.required]],
			subtype: ["", [Validators.required]],
			imageUrl: ["", []],
			abilityText: ["", []],
			legSlots: [0, []],
			armSlots: [0, []],
			headSlots: [0, []],
			hardpointSlots: [0, []],
			modSlots: [0, []],
			coreHealth: [0, []],
			armor: [0, []],
			agility: [0, []],
			energy: [0, []],
			cooldown: [0, []],
			minRange: [0, []],
			maxRange: [0, []],
			direction: ["", []],
			areaOfEffect: ["", []]
		});

		this.formSub = this.formGroup.valueChanges.subscribe((changes) => {
			this.onFormValuesChanged(changes);
		});

		this.routeSub = this.activatedRoute.params.subscribe((val) => {
			if (val.id) {
				this.editMode = true;
				this.cardId = val.id;
			}

			this.globalVars.showPageLoader();
			this.loadPage();
		});
	}

	private loadPage() {
		if (this.editMode) {
			this.api.Cards.get(this.cardId, {
				"filter[include][][relation]": "cardVersions"
			}).subscribe((data) => {
				this.card = data;
				let versionHighlow = this.globalVars.findRecentCardVersions(this.card);
				this.cardVersion = versionHighlow.highest;

				this.formGroup.setValue({
					name: this.card.name,
					rarity: this.card.rarity,
					type: this.card.type,
					subtype: this.card.subtype,
					imageUrl: this.cardVersion.imageUrl,
					abilityText: this.cardVersion.abilityText,
					legSlots: this.cardVersion.legSlots,
					armSlots: this.cardVersion.armSlots,
					headSlots: this.cardVersion.headSlots,
					hardpointSlots: this.cardVersion.hardpointSlots,
					modSlots: this.cardVersion.modSlots,
					coreHealth: this.cardVersion.coreHealth,
					armor: this.cardVersion.armor,
					agility: this.cardVersion.agility,
					energy: this.cardVersion.energy,
					cooldown: this.cardVersion.cooldown,
					minRange: this.cardVersion.minRange,
					maxRange: this.cardVersion.maxRange,
					direction: this.cardVersion.direction,
					areaOfEffect: this.cardVersion.areaOfEffect
				});
				this.formGroup.updateValueAndValidity()

				setTimeout(() => {
					this.globalVars.hidePageLoader();
				}, 200);
			});
		}
		else {
			setTimeout(() => {
				this.globalVars.hidePageLoader();
			}, 200);
		}
	}

	ngOnInit() {

	}

	ngOnDestroy() {
		this.routeSub.unsubscribe();
		this.formSub.unsubscribe();
	}

	ngAfterViewInit() {

	}

	public onFormValuesChanged(formValues) {
		this.cardPreview = new Card(formValues);
		this.cardVersionPreview = new CardVersion(formValues);
	}

	public downloadImage() {
		this.globalVars.showProcessingLoader("Preparing download...");

		let _this = this;
		let node = document.getElementById("card-preview");
		domtoimage.toBlob(node, { width: 375, height: 525 })
			.then(function (blob) {
				saveAs(blob, "card.png");
				_this.globalVars.hideProcessingLoader();
			});
	}

	public saveCard() {
		this.submitted = true;

		if (this.formGroup.valid) {
			this.globalVars.showProcessingLoader("Saving card...");

			let card = new Card(this.formGroup.value);
			delete card.id;
			delete card.cardVersions;

			let cardVersion = new CardVersion(this.formGroup.value);
			delete cardVersion.id;
			delete cardVersion.cardId;

			if (!this.editMode) {
				cardVersion.version = 1;

				this.api.Cards.post("", card).subscribe((cardRes) => {
					this.api.Cards.post(`${cardRes.id}/card-versions`, cardVersion).subscribe((cardVersionRes) => {
						this.globalVars.hideProcessingLoader();
						this.router.navigateByUrl(resolveRouteParams(Routes.Cards.CardView, { id: cardRes.id }));
					});
				});
			}
			else {
				cardVersion.version = this.cardVersion.version + 1;

				this.api.Cards.patch(this.cardId, card).subscribe((cardRes) => {
					this.api.Cards.post(`${this.cardId}/card-versions`, cardVersion).subscribe((cardVersionRes) => {
						this.globalVars.hideProcessingLoader();
						this.router.navigateByUrl(resolveRouteParams(Routes.Cards.CardView, { id: this.cardId }));
					});
				});
			}
		}
		else {
			this.alertService.toastError("Please resolve any error messages present on the form and submit again.", "Form Errors");
		}
	}

	public backToView() {
		this.router.navigateByUrl(resolveRouteParams(Routes.Cards.CardView, { id: this.cardId }));
	}
}
