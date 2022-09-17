import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthProxy } from '@ng-nuc/core';
import { Routes } from '@routes';
import { GlobalVars } from '@services/global-vars.service';
import { Subscription } from 'rxjs';

@Component({
	selector: 'fourzerofour-page',
	templateUrl: './404.page.html',
	styleUrls: ['./404.page.scss'],
})
export class FourZeroFourPage implements OnInit, OnDestroy {

	private routeSub: Subscription;
	public loginRoute = Routes?.Auth?.Login;
	public isAuth: boolean = false;

	constructor(
		private activatedRoute: ActivatedRoute,
		public globalVars: GlobalVars,
		private authProxy: AuthProxy
	) {
		this.routeSub = this.activatedRoute.params.subscribe(val => {
			this.loadPage();
		});
	}

	ngOnInit() {

	}

	ngOnDestroy() {
		this.routeSub.unsubscribe();
	}

	private loadPage() {
		this.authProxy.isAuthenticated().then((isAuth) => {
			this.isAuth = isAuth;
			this.globalVars.hidePageLoader();
		});
	}
}
