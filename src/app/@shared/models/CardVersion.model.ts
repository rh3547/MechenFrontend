export class CardVersion {
	id: number;
	version: string;
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

	constructor(obj?) {
		this.id = obj?.id ?? null;
		this.version = obj?.version ?? null;
		this.imageUrl = obj?.imageUrl ?? null;
		this.abilityText = obj?.abilityText ?? null;
		this.legSlots = obj?.legSlots ?? null;
		this.armSlots = obj?.armSlots ?? null;
		this.headSlots = obj?.headSlots ?? null;
		this.hardpointSlots = obj?.hardpointSlots ?? null;
		this.modSlots = obj?.modSlots ?? null;
		this.coreHealth = obj?.coreHealth ?? null;
		this.armor = obj?.armor ?? null;
		this.agility = obj?.agility ?? null;
		this.energy = obj?.energy ?? null;
		this.cooldown = obj?.cooldown ?? null;
		this.minRange = obj?.minRange ?? null;
		this.maxRange = obj?.maxRange ?? null;
		this.direction = obj?.direction ?? null;
		this.areaOfEffect = obj?.areaOfEffect ?? null;
	}
}
