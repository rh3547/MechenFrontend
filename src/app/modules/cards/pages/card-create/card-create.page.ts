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
import { ConfirmModal } from '@components/modals/confirm-modal/confirm-modal.modal';

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

	public versionOptions: NgnSelectOption[] = [];

	public submitted: boolean = false;
	public formGroup: FormGroup;
	public formSub: Subscription;
	public cardTypeOptions: NgnSelectOption[] = this.globalVars.cardTypeOptions;
	public manufacturerOptions: NgnSelectOption[] = this.globalVars.manufacturerOptions;
	public cardRarityOptions: NgnSelectOption[] = this.globalVars.cardRarityOptions;
	public cardDirectionOptions: NgnSelectOption[] = this.globalVars.cardDirectionOptions;
	public cardAreaOfEffectOptions: NgnSelectOption[] = this.globalVars.cardAreaOfEffectOptions;

	public cardPreview: Card = new Card();
	public highestVersion: number = 0;
	public cardVersionPreview: CardVersion = new CardVersion();

	public downloading: boolean = false;

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
			subtype: ["", []],
			manufacturer: ["", []],
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
			areaOfEffect: ["", []],
			saveAsNewVersion: [false, []]
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
				"filter": JSON.stringify({ "include": [{ "relation": "cardVersions", "scope": { "order": ["version ASC"] } }] })
			}).subscribe((data) => {
				this.card = data;

				this.versionOptions = this.card.cardVersions.map((item) => {
					return new NgnSelectOption({ name: "Version " + item.version, value: item });
				});

				let versionHighlow = this.globalVars.findRecentCardVersions(this.card);
				this.cardVersion = versionHighlow.highest;
				this.highestVersion = versionHighlow.highest.version;

				this.updateFormValuesToCurrentCardVersion();

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
		domtoimage.toBlob(node, { width: 1500, height: 2100, style: { transform: "scale(4)", transformOrigin: "top left" } })
			.then(function (blob) {
				saveAs(blob, "card.png");
				_this.globalVars.hideProcessingLoader();
			});
	}

	public saveCard(createAnother: boolean = false) {
		this.submitted = true;

		if (this.formGroup.valid) {
			this.globalVars.showProcessingLoader("Saving card...");

			let card = new Card(this.card ?? this.formGroup.value);
			card.updateValues(this.formGroup.value);
			delete card.id;
			delete card.cardVersions;

			let cardVersion = new CardVersion(this.cardVersion ?? this.formGroup.value);
			cardVersion.updateValues(this.formGroup.value);
			delete cardVersion.id;
			delete cardVersion.cardId;

			if (this.editMode) {
				if (this.cardVersion.version != this.highestVersion) {
					card.updateValues(this.card);
				}

				this.api.Cards.patch(this.cardId, card).subscribe((cardRes) => {
					if (this.formGroup.controls.saveAsNewVersion.value == true) {
						cardVersion.version = this.highestVersion + 1;

						this.api.Cards.post(`${this.cardId}/card-versions`, cardVersion).subscribe((cardVersionRes) => {
							this.globalVars.hideProcessingLoader();
							this.router.navigateByUrl(resolveRouteParams(Routes.Cards.CardView, { id: this.cardId }));
						});
					}
					else {
						cardVersion.version = this.cardVersion.version;

						this.api.CardVersions.patch(this.cardVersion.id, cardVersion).subscribe((cardVersionRes) => {
							this.globalVars.hideProcessingLoader();
							this.router.navigateByUrl(resolveRouteParams(Routes.Cards.CardView, { id: this.cardId }));
						});
					}
				});
			}
			else {
				cardVersion.version = 1;
				card.approved = false;

				this.api.Cards.post("", card).subscribe((cardRes) => {
					this.api.Cards.post(`${cardRes.id}/card-versions`, cardVersion).subscribe((cardVersionRes) => {
						this.globalVars.hideProcessingLoader();

						if (createAnother) {
							this.reloadPage();
						}
						else {
							this.router.navigateByUrl(resolveRouteParams(Routes.Cards.CardView, { id: cardRes.id }));
						}
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

	private updateFormValuesToCurrentCardVersion() {
		this.formGroup.setValue({
			name: this.cardVersion.name,
			rarity: this.cardVersion.rarity,
			type: this.cardVersion.type,
			subtype: this.cardVersion.subtype,
			manufacturer: this.cardVersion.manufacturer,
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
			areaOfEffect: this.cardVersion.areaOfEffect,
			saveAsNewVersion: false
		});
		this.formGroup.updateValueAndValidity();
	}

	public cardVersionChanged(value) {
		this.cardVersion = value;
		this.updateFormValuesToCurrentCardVersion();
	}

	private reloadPage() {
		if (this.editMode) {
			this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigateByUrl(resolveRouteParams(Routes.Cards.CardEdit, { id: this.cardId })));
		}
		else {
			this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigateByUrl(Routes.Cards.CardCreate));
		}
	}

	public deleteCard() {
		this.showDeleteConfirmation("Delete Card", "Are you sure you want to delete this card? Doing so will delete all versions of this card.")
			.then(() => {
				this.globalVars.showProcessingLoader("Deleting card...");
				this.api.Cards.delete(this.card.id).subscribe(() => {
					let deleteCalls = [];
					this.globalVars.setProcessingText("Deleting card versions...");
					this.card.cardVersions.forEach((cardVersion) => {
						deleteCalls.push(this.api.CardVersions.delete(cardVersion.id).toPromise());
						Promise.all(deleteCalls).then(() => {
							this.globalVars.hideProcessingLoader();
							this.alertService.toastSuccess("Card deleted succcessfully!", "Card Deleted");
							this.router.navigate([Routes.Cards.CardSearch]);
						});
					});
				});
			})
			.catch(() => {

			});
	}

	public deleteCardVersion() {
		this.showDeleteConfirmation("Delete Card Version", "Are you sure you want to delete this card version? Doing so will delete the current card version. All other versions of this card will remain.")
			.then(() => {
				this.globalVars.showProcessingLoader("Deleting card version...");
				this.api.CardVersions.delete(this.cardVersion.id).subscribe(() => {
					this.globalVars.hideProcessingLoader();
					this.alertService.toastSuccess("Card version deleted succcessfully!", "Card Version Deleted");
					this.reloadPage();
				});
			})
			.catch(() => {

			});
	}

	private showDeleteConfirmation(title, message) {
		return new Promise((resolve, reject) => {
			// Present the modal
			var modal = this.modalService.create('confirmDeletion', ConfirmModal, { closable: false, customClass: "confirm-deletion-modal" }).open();

			// Set the modal data
			modal.setData({
				modalId: 'confirmDeletion',
				title: title,
				message: message,
				cancelBtnText: "Cancel",
				confirmBtnText: "Delete",
				cancelBtnClass: "btn thin bg-medium-1",
				confirmBtnClass: "btn thin bg-danger"
			});

			// Respond to the modal closing
			modal.onAnyCloseEventFinished.subscribe((modal: NgxSmartModalComponent) => {
				var data = modal.getData();

				// No, don't delete
				if (data.closeType == "cancel") {
					reject(null);
				}

				// Yes, delete
				if (data.closeType == "confirm") {
					resolve(null);
				}

				this.modalService.removeModal('confirmDeletion');
			});
		});
	}
}
