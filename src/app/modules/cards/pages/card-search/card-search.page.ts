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

	public pendingMode: boolean = false;

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

		this.routeSub = this.activatedRoute.queryParams.subscribe((qp) => {
			if (this.router.url.includes("/pending")) {
				this.pendingMode = true;
			}
			else {
				this.pendingMode = false;
			}

			if (qp.term) {
				this.searchTerm = qp.term;
			}

			if (qp.type) {
				let strType = (<string>qp.type);
				this.cardTypeFilter = strType.substring(0, 1).toUpperCase() + strType.substring(1, strType.length);
			}

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
		let filters = {
			"filter[order][0]": "type ASC",
			"filter[order][1]": "name ASC"
		};

		if (this.pendingMode) {
			filters["filter[where][and][0][approved]"] = false
		}
		else {
			filters["filter[where][and][0][approved]"] = true
		}

		if (this.searchTerm) {
			filters["filter[where][and][1][name][regexp]"] = `/${this.searchTerm}/i`;
			this.globalVars.cardSearchQPs["term"] = this.searchTerm;
		}
		else {
			delete this.globalVars.cardSearchQPs["term"];
		}

		if (this.cardTypeFilter) {
			filters["filter[where][and][2][type]"] = this.cardTypeFilter;
			this.globalVars.cardSearchQPs["type"] = this.cardTypeFilter;
		}
		else {
			delete this.globalVars.cardSearchQPs["type"];
		}

		this.api.Cards.get("", filters).subscribe((data) => {
			this.cards = data;
		});
	}
}
