import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Api } from '@services/api.service';
import { NgxSmartModalService, NgxSmartModalComponent } from "ngx-smart-modal";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GlobalVars } from '@services/global-vars.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { Routes, resolveRouteParams, RouteParts, buildRoute } from '@app/app-routes';
import { NgnSelectOption } from '@ng-nuc/components';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Deck } from '@models/Deck.model';

@Component({
	selector: 'deck-search-page',
	templateUrl: './deck-search.page.html',
	styleUrls: ['./deck-search.page.scss'],
})
export class DeckSearchPage implements OnInit, OnDestroy, AfterViewInit {
	private routeSub: Subscription;
	public routeParts = RouteParts;
	public routes = Routes;

	public pendingMode: boolean = false;

	public deckTypeOptions: NgnSelectOption[] = this.globalVars.deckTypeOptions;

	public searchTerm: string = "";
	private searchTermSubject: Subject<string> = new Subject<string>();

	public deckTypeFilter: string = "";

	public decks: Deck[] = [];

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
				this.getFilteredDecks();
			});

		this.routeSub = this.activatedRoute.queryParams.subscribe((qp) => {
			if (qp.term) {
				this.searchTerm = qp.term;
			}

			if (qp.type) {
				let strType = (<string>qp.type);
				this.deckTypeFilter = strType.substring(0, 1).toUpperCase() + strType.substring(1, strType.length);
			}

			this.loadPage();
		});
	}

	private loadPage() {
		this.getFilteredDecks();
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

	public getDeckRoute(deck: Deck) {
		return resolveRouteParams(Routes.Decks.DeckView, { id: deck.id });
	}

	public searchTermChanged(term: string) {
		this.searchTermSubject.next(term);
	}

	public getFilteredDecks() {
		let filters = {
			"filter[order][0]": "type ASC",
			"filter[order][1]": "name ASC"
		};

		if (this.searchTerm) {
			filters["filter[where][and][1][name][regexp]"] = `/${this.searchTerm}/i`;
			this.globalVars.deckSearchQPs["term"] = this.searchTerm;
		}
		else {
			delete this.globalVars.deckSearchQPs["term"];
		}

		if (this.deckTypeFilter) {
			filters["filter[where][and][2][type]"] = this.deckTypeFilter;
			this.globalVars.deckSearchQPs["type"] = this.deckTypeFilter;
		}
		else {
			delete this.globalVars.deckSearchQPs["type"];
		}

		this.router.navigate([], {
			relativeTo: this.activatedRoute,
			queryParams: this.globalVars.deckSearchQPs
		});

		this.api.Decks.get("", filters).subscribe((data) => {
			this.decks = data;
		});
	}
}
