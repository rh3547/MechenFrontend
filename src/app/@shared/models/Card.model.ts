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
		this.name = obj?.name ?? "";
		this.type = obj?.type ?? "";
		this.subtype = obj?.subtype ?? "";
		this.rarity = obj?.rarity ?? "";
		this.cardVersions = obj?.cardVersions ?? obj?.cardVersions?.map(x => new CardVersion(x)) ?? [];
	}
}
