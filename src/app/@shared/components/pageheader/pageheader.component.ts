import { AfterViewInit, Component, HostListener, Input, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Routes, RouteParts } from '@routes';
import { AuthProxy, LogoutMethod } from '@ng-nuc/core';
import { Router } from '@angular/router';
import { GlobalVars } from '@services';
import { NavService } from '@app/@core/services/nav.service';

@Component({
	selector: 'nuc-pageheader',
	templateUrl: './pageheader.component.html',
	styleUrls: ['./pageheader.component.scss']
})
export class PageHeaderComponent implements OnInit, AfterViewInit {

	public routeParts = RouteParts;
	public routes = Routes;

	@Input() public titleContent = "<h1>Home</h1>";
	@Input() public subtitleContent = "";

	constructor(
		private authProxy: AuthProxy,
		private router: Router,
		private globalVars: GlobalVars,
		public navService: NavService,
		private location: Location
	) { }

	ngOnInit(): void { }

	ngAfterViewInit(): void {
		if (this.router.url != "/") {
			this.scrollTo(this.router.url.replace("/", ""));
		}
	}

	public scrollTo(id: string) {
		this.navService.scrollTo(id);
	}

	@HostListener('window:scroll')
	private checkScrollView() {

	}
}
