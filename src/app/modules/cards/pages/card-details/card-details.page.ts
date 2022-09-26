import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Api } from '@services/api.service';
import { NgxSmartModalService, NgxSmartModalComponent } from "ngx-smart-modal";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GlobalVars } from '@services/global-vars.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Routes, resolveRouteParams, RouteParts } from '@app/app-routes';
import { Card } from '@models';
import { DeckService } from '@services/deck.service';

@Component({
	selector: 'card-details-page',
	templateUrl: './card-details.page.html',
	styleUrls: ['./card-details.page.scss'],
})
export class CardDetailsPage implements OnInit, OnDestroy, AfterViewInit {
	private routeSub: Subscription;
	public routeParts = RouteParts;
	public routes = Routes;

	public cardId;
	public card: Card;

	constructor(
		private api: Api,
		private fb: FormBuilder,
		public globalVars: GlobalVars,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private modalService: NgxSmartModalService,
		public deckService: DeckService
	) {
		this.routeSub = this.activatedRoute.params.subscribe((val) => {
			this.globalVars.showPageLoader();

			if (val.id) {
				this.cardId = val.id;
			}

			this.loadPage();
		});
	}

	private loadPage() {
		this.api.Cards.get(this.cardId, {
			"filter[include][][relation]": "cardVersions"
		}).subscribe((data) => {
			this.card = data;
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
}
