import { CardVersion } from "./CardVersion.model";

export class Card {
	id: number;
	name: string;
	type: string;
	subtype: string;
	rarity: string;
	approved: boolean;
	cardVersions: CardVersion[];

	constructor(obj?) {
		this.id = obj?.id ?? null;
		this.name = obj?.name ?? "";
		this.type = obj?.type ?? "";
		this.subtype = obj?.subtype ?? "";
		this.rarity = obj?.rarity ?? "";
		this.approved = obj?.approved ?? false;
		this.cardVersions = obj?.cardVersions ?? obj?.cardVersions?.map(x => new CardVersion(x)) ?? [];
	}

	updateValues(obj) {
		Object.keys(obj).forEach(key => {
			if (this.hasOwnProperty(key) && obj[key] != null && obj[key] != undefined) {
				this[key] = obj[key];
			}
		});
	}
}
