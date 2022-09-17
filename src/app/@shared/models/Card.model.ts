import { CardVersion } from "./CardVersion.model";

export class Card {
	id: number;
	name: string;
	type: string;
	subtype: string;
	rarity: string;
	cardVersions: CardVersion[];

	constructor(obj?) {
		this.id = obj?.id ?? null;
		this.name = obj?.name ?? null;
		this.type = obj?.type ?? null;
		this.subtype = obj?.subtype ?? null;
		this.rarity = obj?.rarity ?? null;
		this.cardVersions = obj?.cardVersions ?? obj?.cardVersions?.map(x => new CardVersion(x)) ?? [];
	}
}
