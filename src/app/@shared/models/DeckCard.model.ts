import { CardVersion } from "./CardVersion.model";
import { Deck } from "./Deck.model";

export class DeckCard {
	id: number;
	deckId: number;
	cardVersionId: number;
	deck: Deck;
	card: CardVersion;

	constructor(obj?) {
		this.id = obj?.id ?? null;
		this.deckId = obj?.deckId ?? null;
		this.cardVersionId = obj?.cardVersionId ?? null;
		this.card = obj?.card ?? new CardVersion(obj?.card) ?? null;
	}

	updateValues(obj) {
		Object.keys(obj).forEach(key => {
			if (this.hasOwnProperty(key) && obj[key] != null && obj[key] != undefined) {
				this[key] = obj[key];
			}
		});
	}
}
