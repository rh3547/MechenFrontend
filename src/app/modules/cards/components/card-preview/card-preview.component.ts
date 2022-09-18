import { AfterViewInit, Component, HostListener, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GlobalVars } from '@services';
import { Card } from '@models';
import { CardVersion } from '@models/CardVersion.model';

@Component({
	selector: 'card-preview',
	templateUrl: './card-preview.component.html',
	styleUrls: ['./card-preview.component.scss']
})
export class CardPreviewComponent implements OnInit, OnChanges, AfterViewInit {

	@Input() card: Card;
	@Input() cardVersion: CardVersion;
	@Input() hiRes: boolean = false;

	public placeholderCardArtUrl: string = "https://mechen-card-art.s3.amazonaws.com/placeholder_bg_art.png";

	constructor(
		public globalVars: GlobalVars
	) { }

	ngOnInit(): void { }

	ngAfterViewInit(): void { }

	ngOnChanges(changes: SimpleChanges) {
		if (changes.card) {

		}

		if (changes.cardVersion) {

		}
	}
}
