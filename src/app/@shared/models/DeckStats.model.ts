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

		// Special Card Cases
		// ==================

		// Interlaced Armor Plating
		let numInterlacedArmorPlating = cards.filter(x => x.card.name == "Interlaced Armor Plating").length;
		if (numInterlacedArmorPlating > 1) {
			this.armor += (((numInterlacedArmorPlating - 1) * 2) * numInterlacedArmorPlating);
		}

		this.sortCards(this.legs);
		this.sortCards(this.arms);
		this.sortCards(this.heads);
		this.sortCards(this.hardpoints);
		this.sortCards(this.mods);
	}

	updateStatsFromCard(deckCard: DeckCard) {
		let card = deckCard.card;

		if (card.type == "Core") {
			this.core = deckCard;
		}

		else if (card.type == "Leg") {
			this.legs.push(deckCard);
		}

		else if (card.type == "Arm") {
			this.arms.push(deckCard);
		}

		else if (card.type == "Head") {
			this.heads.push(deckCard);
		}

		else if (card.type == "Hardpoint") {
			this.hardpoints.push(deckCard);
		}

		else if (card.type == "Mod") {
			this.mods.push(deckCard);
		}

		this.coreHealth = this.coreHealth + card.coreHealth;
		this.armor = this.armor + card.armor;
		this.agility = this.agility + card.agility;
		this.energy = this.energy + card.energy;
		this.legSlots = this.legSlots + card.legSlots;
		this.armSlots = this.armSlots + card.armSlots;
		this.headSlots = this.headSlots + card.headSlots;
		this.hardpointSlots = this.hardpointSlots + card.hardpointSlots;
		this.modSlots = this.modSlots + card.modSlots;
	}

	public sortCards(cards: DeckCard[]) {
		cards.sort((a: DeckCard, b: DeckCard) => {
			let subtypeA = a.card.subtype.toLowerCase();
			let subtypeB = b.card.subtype.toLowerCase();
			let nameA = a.card.name.toLowerCase();
			let nameB = b.card.name.toLowerCase();

			// if (subtypeA < subtypeB) return -1;
			// if (subtypeA > subtypeB) return 1;
			if (nameA < nameB) return -1;
			if (nameA > nameB) return 1;
			return 0;
		});

		return cards;
	}

	updateValues(obj) {
		Object.keys(obj).forEach(key => {
			if (this.hasOwnProperty(key) && obj[key] != null && obj[key] != undefined) {
				this[key] = obj[key];
			}
		});
	}
}
