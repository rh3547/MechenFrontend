import { AfterViewInit, Component, HostListener, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Api, GlobalVars } from '@services';
import { Router } from '@angular/router';
import { resolveRouteParams, Routes } from '@routes';
import { Deck } from '@models/Deck.model';
import { DeckService } from '@services/deck.service';

@Component({
	selector: 'deck-details',
	templateUrl: './deck-details.component.html',
	styleUrls: ['./deck-details.component.scss']
})
export class DeckDetailsComponent implements OnInit, OnChanges, AfterViewInit {
	@Input() deck: Deck;
	@Input() overlayMode: boolean = false;

	constructor(
		public globalVars: GlobalVars,
		private router: Router,
		private api: Api,
		public deckService: DeckService
	) { }

	ngOnInit(): void { }

	ngAfterViewInit(): void { }

	ngOnChanges(changes: SimpleChanges) {

	}
}
