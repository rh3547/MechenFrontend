import { AfterViewInit, Component, HostListener, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Api, GlobalVars } from '@services';
import { NgnSelectOption } from '@ng-nuc/components';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';
import { resolveRouteParams, Routes } from '@routes';
import { Deck } from '@models/Deck.model';

@Component({
	selector: 'deck-overlay',
	templateUrl: './deck-overlay.component.html',
	styleUrls: ['./deck-overlay.component.scss']
})
export class DeckOverlayComponent implements OnInit, OnChanges, AfterViewInit {

	@Input() deck: Deck;

	constructor(
		public globalVars: GlobalVars,
		private router: Router,
		private api: Api
	) { }

	ngOnInit(): void { }

	ngAfterViewInit(): void { }

	ngOnChanges(changes: SimpleChanges) {

	}
}
