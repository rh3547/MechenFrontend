import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Api } from '@services/api.service';
import { NgxSmartModalService, NgxSmartModalComponent } from "ngx-smart-modal";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GlobalVars } from '@services/global-vars.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Routes, resolveRouteParams, RouteParts } from '@app/app-routes';
import { NgnSelectOption } from '@ng-nuc/components';
import { AlertService } from '@ng-nuc/core';
import { ConfirmModal } from '@components/modals/confirm-modal/confirm-modal.modal';
import { Deck } from '@models/Deck.model';

@Component({
	selector: 'deck-create-page',
	templateUrl: './deck-create.page.html',
	styleUrls: ['./deck-create.page.scss'],
})
export class DeckCreatePage implements OnInit, OnDestroy, AfterViewInit {
	private routeSub: Subscription;
	public routeParts = RouteParts;
	public routes = Routes;

	public editMode = false;
	public deckId: number;
	public deck: Deck;

	public submitted: boolean = false;
	public formGroup: FormGroup;
	public deckTypeOptions: NgnSelectOption[] = this.globalVars.deckTypeOptions;

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
			type: ["", [Validators.required]]
		});

		this.routeSub = this.activatedRoute.params.subscribe((val) => {
			if (val.id) {
				this.editMode = true;
				this.deckId = val.id;
			}

			this.globalVars.showPageLoader();
			this.loadPage();
		});
	}

	private loadPage() {
		if (this.editMode) {
			this.api.Decks.get(this.deckId, {
				"filter": JSON.stringify({ "include": [{ "relation": "cards" }] })
			}).subscribe((data) => {
				this.deck = data;
				this.updateFormValues();

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
	}

	ngAfterViewInit() {

	}

	public saveDeck(createAnother: boolean = false) {
		this.submitted = true;

		if (this.formGroup.valid) {
			this.globalVars.showProcessingLoader("Saving deck...");

			let deck = new Deck(this.deck ?? this.formGroup.value);
			deck.updateValues(this.formGroup.value);
			delete deck.id;
			delete deck.cards;
			delete deck.deckStats;

			if (this.editMode) {
				this.api.Decks.patch(this.deckId, deck).subscribe((deckRes) => {
					this.globalVars.hideProcessingLoader();
					this.router.navigateByUrl(resolveRouteParams(Routes.Decks.DeckView, { id: this.deckId }));
				});
			}
			else {
				this.api.Decks.post("", deck).subscribe((deckRes) => {
					this.globalVars.hideProcessingLoader();

					if (createAnother) {
						this.reloadPage();
					}
					else {
						this.router.navigateByUrl(resolveRouteParams(Routes.Decks.DeckView, { id: deckRes.id }));
					}
				});
			}
		}
		else {
			this.alertService.toastError("Please resolve any error messages present on the form and submit again.", "Form Errors");
		}
	}

	public backToView() {
		this.router.navigateByUrl(resolveRouteParams(Routes.Decks.DeckView, { id: this.deckId }));
	}

	private updateFormValues() {
		this.formGroup.setValue({
			name: this.deck.name,
			type: this.deck.type
		});
		this.formGroup.updateValueAndValidity();
	}

	private reloadPage() {
		if (this.editMode) {
			this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigateByUrl(resolveRouteParams(Routes.Decks.DeckEdit, { id: this.deckId })));
		}
		else {
			this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => this.router.navigateByUrl(Routes.Decks.DeckCreate));
		}
	}

	public deleteDeck() {
		this.showDeleteConfirmation("Delete Deck", "Are you sure you want to delete this deck?")
			.then(() => {
				this.globalVars.showProcessingLoader("Deleting deck...");
				this.api.Decks.delete(this.deck.id).subscribe(() => {
					if (this.deck?.cards && this.deck?.cards?.length > 0) {
						let deleteCalls = [];
						this.globalVars.setProcessingText("Deleting cards in deck...");
						this.deck.cards.forEach((deckCard) => {
							deleteCalls.push(this.api.DeckCards.delete(deckCard.id).toPromise());
						});
						Promise.all(deleteCalls).then(() => {
							this.globalVars.hideProcessingLoader();
							this.alertService.toastSuccess("Deck deleted succcessfully!", "Deck Deleted");
							this.router.navigate([Routes.Decks.DeckSearch]);
						});
					}
					else {
						this.globalVars.hideProcessingLoader();
						this.alertService.toastSuccess("Deck deleted succcessfully!", "Deck Deleted");
						this.router.navigate([Routes.Decks.DeckSearch]);
					}
				});
			})
			.catch(() => { });
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
