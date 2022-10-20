import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Api } from '@services/api.service';
import { NgxSmartModalService, NgxSmartModalComponent } from "ngx-smart-modal";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GlobalVars } from '@services/global-vars.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Routes, resolveRouteParams, RouteParts } from '@app/app-routes';
import { Deck } from '@models/Deck.model';
import { DeckStats } from '@models/DeckStats.model';
import { DeckService } from '@services/deck.service';
import { AlertPosition, AlertService } from '@ng-nuc/core';
import { ConfirmModal } from '@components/modals/confirm-modal/confirm-modal.modal';
import { DeckCard } from '@app/@shared/models/DeckCard.model';

@Component({
	selector: 'playtest-page',
	templateUrl: './playtest.page.html',
	styleUrls: ['./playtest.page.scss'],
})
export class PlaytestPage implements OnInit, OnDestroy, AfterViewInit {
	private routeSub: Subscription;
	public routeParts = RouteParts;
	public routes = Routes;

	public deckId;
	public deck: Deck;

	public maxCoreHealth: number = 0;
	public maxArmor: number = 0;
	public maxAgility: number = 0;
	public maxEnergy: number = 0;

	public currentCoreHealth: number = 0;
	public currentArmor: number = 0;
	public currentAgility: number = 0;
	public currentEnergy: number = 0;

	public coreHealthModifier: number = 1;
	public armorModifier: number = 1;
	public agilityModifier: number = 1;
	public energyModifier: number = 1;

	public currentRound: number = 1;
	public lowEnergyMode: boolean = false;
	public emergencyShutdownMode: boolean = false;

	public hardpointCooldowns = {};
	public modCooldowns = {};

	public percentChance: number = 25;
	public chanceTimes: number = 1;

	constructor(
		private api: Api,
		private fb: FormBuilder,
		public globalVars: GlobalVars,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private modalService: NgxSmartModalService,
		private alertService: AlertService,
		public deckService: DeckService
	) {
		this.routeSub = this.activatedRoute.params.subscribe((val) => {
			this.globalVars.showPageLoader();

			if (val.id) {
				this.deckId = val.id;
			}

			this.loadPage();
		});
	}

	private loadPage() {
		this.api.Decks.get(this.deckId, {
			"filter": JSON.stringify({ "include": [{ "relation": "cards", "scope": { "include": [{ "relation": "card" }] } }] })
		}).subscribe((data) => {
			let deckStats = new DeckStats({ cards: data.cards });
			this.deck = new Deck({ ...data, deckStats: deckStats });

			this.maxCoreHealth = this.deck.deckStats.coreHealth;
			this.maxArmor = this.deck.deckStats.armor;
			this.maxAgility = this.deck.deckStats.agility;
			this.maxEnergy = this.deck.deckStats.energy;

			this.currentCoreHealth = this.deck.deckStats.coreHealth;
			this.currentArmor = this.deck.deckStats.armor;
			this.currentAgility = this.deck.deckStats.agility;
			this.currentEnergy = this.deck.deckStats.energy;

			setTimeout(() => {
				this.globalVars.hidePageLoader();
			}, 200);
		});
	}

	ngOnInit() {

	}

	ngOnDestroy() {
		this.routeSub.unsubscribe();
	}

	ngAfterViewInit() {

	}

	public getEditRoute() {
		return resolveRouteParams(Routes.Decks.DeckEdit, { id: this.deckId });
	}

	public getViewDeckRoute() {
		return resolveRouteParams(Routes.Decks.DeckView, { id: this.deckId });
	}

	public startTurn() {
		this.currentAgility = this.maxAgility;

		Object.keys(this.hardpointCooldowns)?.forEach((key) => {
			this.hardpointCooldowns[key] = (this.hardpointCooldowns[key] <= 1) ? 0 : (this.hardpointCooldowns[key] - 1);
		});

		Object.keys(this.modCooldowns)?.forEach((key) => {
			this.modCooldowns[key] = (this.modCooldowns[key] <= 1) ? 0 : (this.modCooldowns[key] - 1);
		});
	}

	public checkEnergy() {
		if (!this.emergencyShutdownMode && this.currentEnergy <= 0) {
			this.emergencyShutdownMode = true;
			this.lowEnergyMode = false;
			this.maxAgility = 0;
			this.currentAgility = 0;
		}
		else if (!this.emergencyShutdownMode && !this.lowEnergyMode && this.currentEnergy == 1) {
			this.lowEnergyMode = true;
			this.maxAgility = Math.floor(this.maxAgility / 2);
			this.currentAgility = Math.floor(this.currentAgility / 2);
		}
	}

	public exitLowEnergy() {
		this.maxAgility = this.deck.deckStats.agility;
		this.lowEnergyMode = false;
	}

	public exitEmergenceyShutdown() {
		this.maxAgility = this.deck.deckStats.agility;
		this.emergencyShutdownMode = false;
	}

	public removeHardpointCooldown(index: number) {
		if (this.hardpointCooldowns.hasOwnProperty(index)) {
			if (this.hardpointCooldowns[index] <= 1) {
				this.hardpointCooldowns[index] = 0;
			}
			else {
				this.hardpointCooldowns[index] = this.hardpointCooldowns[index] - 1;
			}
		}
		else {
			this.hardpointCooldowns[index] = 0;
		}
	}

	public addHardpointCooldown(index: number) {
		if (this.hardpointCooldowns.hasOwnProperty(index)) {
			this.hardpointCooldowns[index] = this.hardpointCooldowns[index] + 1;
		}
		else {
			this.hardpointCooldowns[index] = 1;
		}
	}

	public removeModCooldown(index: number) {
		if (this.modCooldowns.hasOwnProperty(index)) {
			if (this.modCooldowns[index] <= 1) {
				this.modCooldowns[index] = 0;
			}
			else {
				this.modCooldowns[index] = this.modCooldowns[index] - 1;
			}
		}
		else {
			this.modCooldowns[index] = 0;
		}
	}

	public addModCooldown(index: number) {
		if (this.modCooldowns.hasOwnProperty(index)) {
			this.modCooldowns[index] = this.modCooldowns[index] + 1;
		}
		else {
			this.modCooldowns[index] = 1;
		}
	}

	public getHardpointTokenArray(index: number) {
		if (!this.hardpointCooldowns[index]) return [];
		return Array.apply(null, Array(this.hardpointCooldowns[index]));
	}

	public getModTokenArray(index: number) {
		if (!this.modCooldowns[index]) return [];
		return Array.apply(null, Array(this.modCooldowns[index]));
	}

	public isHardpointOnCooldown(index: number) {
		return this.hardpointCooldowns[index];
	}

	public isModOnCooldown(index: number) {
		return this.modCooldowns[index];
	}

	public checkChance() {
		let successes = 0;
		for (let i = 0; i < this.chanceTimes; i++) {
			successes = successes + (Math.random() < (this.percentChance / 100) ? 1 : 0);
		}

		if (this.chanceTimes > 1) {
			this.alertService.toast(`You succeeded a ${this.percentChance}% chance ${successes}/${this.chanceTimes} times.`, "Chance Results", 2000, "", AlertPosition.BOTTOM_RIGHT);
		}
		else if (successes > 0) {
			this.alertService.toastSuccess(`Your ${this.percentChance}% chance was successful!`, "Success", 2000, "", AlertPosition.BOTTOM_RIGHT);
		}
		else {
			this.alertService.toastError(`Your ${this.percentChance}% chance has failed..`, "Failed", 2000, "", AlertPosition.BOTTOM_RIGHT);
		}
	}
}

