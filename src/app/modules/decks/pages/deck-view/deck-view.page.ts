import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Api } from '@services/api.service';
import { NgxSmartModalService, NgxSmartModalComponent } from "ngx-smart-modal";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GlobalVars } from '@services/global-vars.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Routes, resolveRouteParams, RouteParts } from '@app/app-routes';
import { Deck } from '@models/Deck.model';
import { DeckStats } from '@models/DeckStats.model';
import { DeckService } from '@services/deck.service';
import { AlertService } from '@ng-nuc/core';
import { ConfirmModal } from '@components/modals/confirm-modal/confirm-modal.modal';
import { DeckCard } from '@app/@shared/models/DeckCard.model';

@Component({
	selector: 'deck-view-page',
	templateUrl: './deck-view.page.html',
	styleUrls: ['./deck-view.page.scss'],
})
export class DeckViewPage implements OnInit, OnDestroy, AfterViewInit {
	private routeSub: Subscription;
	public routeParts = RouteParts;
	public routes = Routes;

	public deckId;
	public deck: Deck;

	constructor(
		private api: Api,
		private fb: FormBuilder,
		public globalVars: GlobalVars,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private modalService: NgxSmartModalService,
		private alertService: AlertService,
		public deckService: DeckService
	) {
		this.routeSub = this.activatedRoute.params.subscribe((val) => {
			this.globalVars.showPageLoader();

			if (val.id) {
				this.deckId = val.id;
			}

			this.loadPage();
		});
	}

	private loadPage() {
		this.api.Decks.get(this.deckId, {
			"filter": JSON.stringify({ "include": [{ "relation": "cards", "scope": { "include": [{ "relation": "card" }] } }] })
		}).subscribe((data) => {
			let deckStats = new DeckStats({ cards: data.cards });
			this.deck = new Deck({ ...data, deckStats: deckStats });
			setTimeout(() => {
				this.globalVars.hidePageLoader();
			}, 200);
		});
	}

	ngOnInit() {

	}

	ngOnDestroy() {
		this.routeSub.unsubscribe();
	}

	ngAfterViewInit() {

	}

	getEditRoute() {
		return resolveRouteParams(Routes.Decks.DeckEdit, { id: this.deckId });
	}

	getViewCardRoute(deckCard: DeckCard) {
		return resolveRouteParams(Routes.Cards.CardView, { id: deckCard.card.cardId });
	}

	getPlaytestRoute() {
		return resolveRouteParams(Routes.Decks.DeckPlaytest, { id: this.deckId });
	}

	addCardsToDeck(cardType: string) {
		this.deckService.setCurrentDeck(this.deck);
		this.navToCardSearch(cardType);
	}

	navToCardSearch(cardType: string) {
		this.router.navigate([Routes.Cards.CardSearch], { queryParams: cardType ? { type: cardType } : this.globalVars.cardSearchQPs });
	}

	public deleteCard(deckCard: DeckCard) {
		this.showDeleteConfirmation("Remove Crad From Deck", "Are you sure you want to remove this card from the deck?")
			.then(() => {
				this.globalVars.showProcessingLoader("Removing card...");
				this.api.DeckCards.delete(deckCard.id).subscribe(() => {
					this.deck.cards.splice(this.deck.cards.findIndex(x => x.id == deckCard.id), 1);
					let deckStats = new DeckStats({ cards: this.deck.cards });
					this.deck = new Deck({ ...this.deck, deckStats: deckStats });

					if (this.deckService.currentDeck?.id == this.deck.id) {
						this.deckService.currentDeck = this.deck;
					}

					this.globalVars.hideProcessingLoader();
					this.alertService.toastSuccess("Card removed succcessfully!", "Card Removed");
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
				confirmBtnText: "Remove",
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
