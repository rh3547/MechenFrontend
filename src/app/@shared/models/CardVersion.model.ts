export class CardVersion {
	id: number;
	version: number;
	name: string;
	type: string;
	subtype: string;
	rarity: string;
	imageUrl: string;
	abilityText: string;
	legSlots: number;
	armSlots: number;
	headSlots: number;
	hardpointSlots: number;
	modSlots: number;
	coreHealth: number;
	armor: number;
	agility: number;
	energy: number;
	cooldown: number;
	minRange: number;
	maxRange: number;
	direction: string;
	areaOfEffect: string;
	cardId: number;

	constructor(obj?) {
		this.id = obj?.id ?? null;
		this.version = obj?.version ?? null;
		this.name = obj?.name ?? "";
		this.type = obj?.type ?? "";
		this.subtype = obj?.subtype ?? "";
		this.rarity = obj?.rarity ?? "";
		this.imageUrl = obj?.imageUrl ?? "https://mechen-card-art.s3.amazonaws.com/placeholder_bg_art.png";
		this.abilityText = obj?.abilityText ?? "";
		this.legSlots = obj?.legSlots ?? 0;
		this.armSlots = obj?.armSlots ?? 0;
		this.headSlots = obj?.headSlots ?? 0;
		this.hardpointSlots = obj?.hardpointSlots ?? 0;
		this.modSlots = obj?.modSlots ?? 0;
		this.coreHealth = obj?.coreHealth ?? 0;
		this.armor = obj?.armor ?? 0;
		this.agility = obj?.agility ?? 0;
		this.energy = obj?.energy ?? 0;
		this.cooldown = obj?.cooldown ?? 0;
		this.minRange = obj?.minRange ?? 0;
		this.maxRange = obj?.maxRange ?? 0;
		this.direction = obj?.direction ?? "";
		this.areaOfEffect = obj?.areaOfEffect ?? "";
		this.cardId = obj?.cardId ?? null;
	}
}
