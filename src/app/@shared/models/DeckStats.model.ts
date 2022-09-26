import { CardVersion } from "./CardVersion.model";
import { DeckCard } from "./DeckCard.model";

export class DeckStats {
	coreHealth: number;
	armor: number;
	agility: number;
	energy: number;
	legSlots: number;
	armSlots: number;
	headSlots: number;
	hardpointSlots: number;
	modSlots: number;

	core: DeckCard;
	legs: DeckCard[];
	arms: DeckCard[];
	heads: DeckCard[];
	hardpoints: DeckCard[];
	mods: DeckCard[];

	constructor(obj?) {
		this.coreHealth = obj?.coreHealth ?? 0;
		this.armor = obj?.armor ?? 0;
		this.agility = obj?.agility ?? 0;
		this.energy = obj?.energy ?? 0;
		this.legSlots = obj?.legSlots ?? 0;
		this.armSlots = obj?.armSlots ?? 0;
		this.headSlots = obj?.headSlots ?? 0;
		this.hardpointSlots = obj?.hardpointSlots ?? 0;
		this.modSlots = obj?.modSlots ?? 0;

		this.core = obj?.core ?? null;
		this.legs = obj?.legs ?? [];
		this.arms = obj?.arms ?? [];
		this.heads = obj?.heads ?? [];
		this.hardpoints = obj?.hardpoints ?? [];
		this.mods = obj?.mods ?? [];

		if (obj?.cards) {
			this.updateStatsFromDeckCards(obj.cards);
		}
	}

	updateStatsFromDeckCards(cards: DeckCard[]) {
		cards.forEach((deckCard: DeckCard) => {
			this.updateStatsFromCard(deckCard);
		});
	}

	updateStatsFromCard(deckCard: DeckCard) {
		if (deckCard.card.type == "Core") {
			this.core = deckCard;
		}

		else if (deckCard.card.type == "Leg") {
			this.legs.push(deckCard);
		}

		else if (deckCard.card.type == "Arm") {
			this.arms.push(deckCard);
		}

		else if (deckCard.card.type == "Head") {
			this.heads.push(deckCard);
		}

		else if (deckCard.card.type == "Hardpoint") {
			this.hardpoints.push(deckCard);
		}

		else if (deckCard.card.type == "Mod") {
			this.mods.push(deckCard);
		}

		this.coreHealth = this.coreHealth + deckCard.card.coreHealth;
		this.armor = this.armor + deckCard.card.armor;
		this.agility = this.agility + deckCard.card.agility;
		this.energy = this.energy + deckCard.card.energy;
		this.legSlots = this.legSlots + deckCard.card.legSlots;
		this.armSlots = this.armSlots + deckCard.card.armSlots;
		this.headSlots = this.headSlots + deckCard.card.headSlots;
		this.hardpointSlots = this.hardpointSlots + deckCard.card.hardpointSlots;
		this.modSlots = this.modSlots + deckCard.card.modSlots;
	}

	updateValues(obj) {
		Object.keys(obj).forEach(key => {
			if (this.hasOwnProperty(key) && obj[key] != null && obj[key] != undefined) {
				this[key] = obj[key];
			}
		});
	}
}
