import { AfterViewInit, Component, HostListener, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { GlobalVars } from '@services';
import { Card } from '@models';
import { CardVersion } from '@models/CardVersion.model';
import { NgnSelectOption } from '@ng-nuc/components';
import domtoimage from 'dom-to-image';
import { saveAs } from 'file-saver';
import { Router } from '@angular/router';
import { resolveRouteParams, Routes } from '@routes';

@Component({
	selector: 'card-viewer',
	templateUrl: './card-viewer.component.html',
	styleUrls: ['./card-viewer.component.scss']
})
export class CardViewerComponent implements OnInit, OnChanges, AfterViewInit {

	@Input() card: Card;

	public cardVersion: CardVersion;
	public compareCardVersion: CardVersion;
	public versionOptions: NgnSelectOption[];

	constructor(
		public globalVars: GlobalVars,
		private router: Router,
	) { }

	ngOnInit(): void { }

	ngAfterViewInit(): void { }

	ngOnChanges(changes: SimpleChanges) {
		if (changes.card) {
			if (changes.card?.currentValue?.cardVersions) {
				this.versionOptions = changes.card.currentValue.cardVersions.map((item) => {
					return new NgnSelectOption({ name: "Version " + item.version, value: item });
				});
			}

			let versionHighlow = this.globalVars.findRecentCardVersions(changes.card.currentValue);

			if (versionHighlow) {
				this.cardVersion = versionHighlow.highest;
				this.compareCardVersion = versionHighlow.previous;
			}
		}
	}

	public downloadImage() {
		this.globalVars.showProcessingLoader("Preparing download...");

		let _this = this;
		let node = document.getElementById("card-preview");
		domtoimage.toBlob(node, { width: 1500, height: 2100, style: { transform: "scale(4)", transformOrigin: "top left" } })
			.then(function (blob) {
				saveAs(blob, "card.png");
				_this.globalVars.hideProcessingLoader();
			});
	}

	public editCard() {
		this.router.navigateByUrl(resolveRouteParams(Routes.Cards.CardEdit, { id: this.card.id }));
	}
}
