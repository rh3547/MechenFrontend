import { DescribeAttackStatisticsRequest } from "aws-sdk/clients/shield";
import { DeckCard } from "./DeckCard.model";
import { DeckStats } from "./DeckStats.model";

export class Deck {
	id: number;
	name: string;
	type: string;
	cards: DeckCard[];
	deckStats: DeckStats;

	constructor(obj?) {
		this.id = obj?.id ?? null;
		this.name = obj?.name ?? "";
		this.type = obj?.type ?? "";
		this.cards = obj?.cards ?? obj?.cards?.map(x => new DeckCard(x)) ?? [];
		this.deckStats = obj?.deckStats ?? new DeckCard(obj?.deckStats) ?? null;
	}

	updateValues(obj) {
		Object.keys(obj).forEach(key => {
			if (this.hasOwnProperty(key) && obj[key] != null && obj[key] != undefined) {
				this[key] = obj[key];
			}
		});
	}
}
