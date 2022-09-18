import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';

import { ApiService, AlertService, GenericApiService } from '@ng-nuc/core';

export declare class PatchConfig {
	path: string;
	value: any;
	op?: string;
}

@Injectable({
	providedIn: 'root',
})
export class Api {

	private globalApiUrl = environment.apiUrl + environment.apiUrlExtension;

	constructor(
		private http: HttpClient,
		private alertService: AlertService
	) { }

	public Cards = new GenericApiService(this.http).setApiUrl(this.globalApiUrl + "/cards");
	public CardVersions = new GenericApiService(this.http).setApiUrl(this.globalApiUrl + "/card-versions");
}
