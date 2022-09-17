import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Api } from '@services/api.service';
import { NgxSmartModalService, NgxSmartModalComponent } from "ngx-smart-modal";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GlobalVars } from '@services/global-vars.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { Routes, resolveRouteParams, RouteParts, buildRoute } from '@app/app-routes';
import { Card } from '@models';
import { NgnSelectOption } from '@ng-nuc/components';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
	selector: 'card-search-page',
	templateUrl: './card-search.page.html',
	styleUrls: ['./card-search.page.scss'],
})
export class CardSearchPage implements OnInit, OnDestroy, AfterViewInit {
	private routeSub: Subscription;
	public routeParts = RouteParts;
	public routes = Routes;

	public cardTypeOptions: NgnSelectOption[] = this.globalVars.cardTypeOptions;

	public searchTerm: string = "";
	private searchTermSubject: Subject<string> = new Subject<string>();

	public cardTypeFilter: string = "";

	public cards: Card[] = [];

	constructor(
		private api: Api,
		private fb: FormBuilder,
		public globalVars: GlobalVars,
		private activatedRoute: ActivatedRoute,
		private router: Router,
		private modalService: NgxSmartModalService
	) {
		this.searchTermSubject
			.pipe(debounceTime(300), distinctUntilChanged())
			.subscribe(value => {
				this.getFilteredCards();
			});

		this.routeSub = this.activatedRoute.params.subscribe((val) => {
			this.loadPage();
		});
	}

	private loadPage() {
		this.getFilteredCards();
	}

	ngOnInit() {

	}

	ngOnDestroy() {
		this.routeSub.unsubscribe();
	}

	ngAfterViewInit() {
		setTimeout(() => {
			this.globalVars.hidePageLoader();
		}, 200);
	}

	public getCardRoute(card: Card) {
		return resolveRouteParams(Routes.Cards.CardView, { id: card.id });
	}

	public searchTermChanged(term: string) {
		this.searchTermSubject.next(term);
	}

	public getFilteredCards() {
		let filters = {};

		if (this.searchTerm) {
			filters["filter[where][and][0][name][regexp]"] = `/${this.searchTerm}/i`;
		}

		if (this.cardTypeFilter) {
			filters["filter[where][and][1][type]"] = this.cardTypeFilter;
		}

		this.api.Cards.get("", filters).subscribe((data) => {
			this.cards = data;
		});
	}
}
