import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Api } from '@services/api.service';
import { NgxSmartModalService, NgxSmartModalComponent } from "ngx-smart-modal";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GlobalVars } from '@services/global-vars.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { Routes, resolveRouteParams, RouteParts } from '@app/app-routes';
import { Card } from '@models';
import { NgnSelectOption } from '@ng-nuc/components';
import { CardVersion } from '@app/@shared/models/CardVersion.model';

@Component({
	selector: 'card-create-page',
	templateUrl: './card-create.page.html',
	styleUrls: ['./card-create.page.scss'],
})
export class CardCreatePage implements OnInit, OnDestroy, AfterViewInit {
	private routeSub: Subscription;
	public routeParts = RouteParts;
	public routes = Routes;

	public formGroup: FormGroup;
	public formSub: Subscription;
	public cardTypeOptions: NgnSelectOption[] = this.globalVars.cardTypeOptions;
	public cardRarityOptions: NgnSelectOption[] = this.globalVars.cardRarityOptions;
	public cardDirectionOptions: NgnSelectOption[] = this.globalVars.cardDirectionOptions;
	public cardAreaOfEffectOptions: NgnSelectOption[] = this.globalVars.cardAreaOfEffectOptions;

	public cardPreview: Card = new Card();
	public cardVersionPreview: CardVersion = new CardVersion();

	constructor(
		private api: Api,
		private fb: FormBuilder,
		public globalVars: GlobalVars,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private modalService: NgxSmartModalService
	) {
		this.formGroup = this.fb.group({
			name: ["", [Validators.required]],
			rarity: ["", [Validators.required]],
			type: ["", [Validators.required]],
			subtype: ["", [Validators.required]],
			imageUrl: ["", []],
			abilityText: ["", []],
			legSlots: [0, []],
			armSlots: [0, []],
			headSlots: [0, []],
			hardpointSlots: [0, []],
			modSlots: [0, []],
			coreHealth: [0, []],
			armor: [0, []],
			agility: [0, []],
			energy: [0, []],
			cooldown: [0, []],
			minRange: [0, []],
			maxRange: [0, []],
			direction: [0, []],
			areaOfEffect: [0, []]
		});

		this.formSub = this.formGroup.valueChanges.subscribe((changes) => {
			this.onFormValuesChanged(changes);
		});

		this.routeSub = this.activatedRoute.params.subscribe((val) => {
			this.globalVars.showPageLoader();
			this.loadPage();
		});
	}

	private loadPage() {
		setTimeout(() => {
			this.globalVars.hidePageLoader();
		}, 200);
	}

	ngOnInit() {

	}

	ngOnDestroy() {
		this.routeSub.unsubscribe();
		this.formSub.unsubscribe();
	}

	ngAfterViewInit() {

	}

	public onFormValuesChanged(formValues) {
		this.cardPreview = new Card(formValues);
		this.cardVersionPreview = new CardVersion(formValues);
	}
}
