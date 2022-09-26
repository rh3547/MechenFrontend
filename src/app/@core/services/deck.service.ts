import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { resolveRouteParams, Routes } from '@routes';
import { Deck } from '@models/Deck.model';
import { CardVersion } from '@models/CardVersion.model';
import { DeckStats } from '@models/DeckStats.model';
import { Api } from './api.service';
import { GlobalVars } from './global-vars.service';
import { DeckCard } from '@app/@shared/models/DeckCard.model';

@Injectable({
	providedIn: 'root'
})
export class DeckService {

	public currentDeck = null;

	constructor(
		private router: Router,
		private api: Api,
		private globalVars: GlobalVars
	) { }

	public getCurrentDeck() {
		return this.currentDeck;
	}

	public setCurrentDeck(deck: Deck) {
		this.currentDeck = deck;
	}

	public viewDeck() {
		this.router.navigate([resolveRouteParams(Routes.Decks.DeckView, { id: this.currentDeck.id })]);
	}

	public finishEditingDeck() {
		this.router.navigate([resolveRouteParams(Routes.Decks.DeckView, { id: this.currentDeck.id })]);
		this.currentDeck = null;
	}

	public canAddCardToDeck(card: CardVersion) {
		if (this.currentDeck) {
			let deck: Deck = this.currentDeck;
			let deckStats: DeckStats = this.currentDeck.deckStats;

			if (deck.type == "Mech") {
				if (card.type == "Core" && !deckStats.core) return true;
				else if (card.type == "Leg" && deckStats.legs.length < deckStats.legSlots) return true;
				else if (card.type == "Arm" && deckStats.arms.length < deckStats.armSlots) return true;
				else if (card.type == "Head" && deckStats.heads.length < deckStats.headSlots) return true;
				else if (card.type == "Hardpoint" && deckStats.hardpoints.length < deckStats.hardpointSlots) return true;
				else if (card.type == "Mod" && deckStats.mods.length < deckStats.modSlots) return true;
			}
		}

		return false;
	}

	public addCardToDeck(card: CardVersion) {
		if (this.currentDeck) {
			let deck: Deck = this.currentDeck;
			let deckStats: DeckStats = this.currentDeck.deckStats;

			this.globalVars.showProcessingLoader("Adding card to deck...");
			this.api.DeckCards.post("", {
				deckId: deck.id,
				cardVersionId: card.id
			}).subscribe((res) => {
				let deckCard = new DeckCard({ ...res, card: card });
				deckStats.updateStatsFromCard(deckCard);
				this.globalVars.hideProcessingLoader();
			});
		}
	}
}
