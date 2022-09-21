import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as moment from 'moment';
import { BehaviorSubject } from 'rxjs';
import { Api } from './api.service';
import { AlertService } from '@ng-nuc/core';
import { NgnSelectOption } from '@ng-nuc/components';
import { Card } from '@app/@shared/models';

const END_DATE_RANGE_FILTER = "EndDateRangeFilter";
const LOW_SEARCH_AMOUNT_THRESHOLD = "LowSearchAmountThreshold";

@Injectable({
	providedIn: 'root',
})
export class GlobalVars {

	public appVersion = "1.2";

	public minDateMoment = moment().year(1900).month(1).date(1);
	public maxDateMoment = moment().month(1).date(1).add(100, "years");
	public currentDateMoment = moment();
	private userRoles: string[] = [];

	public minDateDatePicker: any = { year: this.minDateMoment.year(), month: this.minDateMoment.month(), day: this.minDateMoment.date() };
	public maxDateDatePicker: any = { year: this.maxDateMoment.year(), month: this.maxDateMoment.month() + 1, day: this.maxDateMoment.date() };
	public currentDateDatePicker: any = { year: this.currentDateMoment.year(), month: this.currentDateMoment.month() + 1, day: this.currentDateMoment.date() };

	public defaultOptionsHeight = 300;

	// GLOBAL REGEX
	public defaultTextRegex = new RegExp(/^[a-zA-Z0-9 \-,.'!@#&*_=+^:;%$|?()]*$/);
	public nameRegex = new RegExp(/^([a-zA-Z ,.'!@#&*_=+^:;%$|?()]*)([a-z])([a-zA-Z ,.'!@#&*_=+^:;%$|?()]*)$/);
	public phoneRegex = new RegExp(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}$/);
	public zipcodeRegex = new RegExp(/(^(?!0{5})(\d{5})(?!-?0{4})(-?\d{4})?$)/);
	public urlRegex = new RegExp(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?|^((http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/);
	public ipAddressRegex = new RegExp(/^(?=.*[^\.]$)((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.?){4}$/);
	public timeRegex = new RegExp(/^(([0-1][0-9])|(2[0-3])):[0-5][0-9]$/);
	public numericRegex = new RegExp(/^\d+$/);
	public alphanumericRegex = new RegExp(/^[\w\-\s]+$/); // \w is the same as [A-za-z0-9_]
	public positiveNumericRegex = new RegExp(/^[+]?\d+([.]\d+)?$/);
	public decimalRegex = new RegExp(/^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/);

	// GLOBAL MASKS
	public phoneMask = "000-000-0000";
	public faxMask = "000-000-0000";
	public dateMask = "99/99/9999";

	// COLORS
	public backgroundColor = "#14141B";
	public backgroundLightColor = "#21212B";
	public contrastColor = "#FFFFFF";
	public contrastMutedColor = "#B9B9BB";
	public primaryColor = "#3EC4FF";

	private showPageLoader$ = new BehaviorSubject(false);
	private showProcessingLoader$ = new BehaviorSubject(false);
	private defaultProcessingText = "Processing...";
	private processingText = this.defaultProcessingText;

	public cardTypeOptions: NgnSelectOption[] = [
		new NgnSelectOption({ name: "Core", value: "Core" }),
		new NgnSelectOption({ name: "Leg", value: "Leg" }),
		new NgnSelectOption({ name: "Arm", value: "Arm" }),
		new NgnSelectOption({ name: "Head", value: "Head" }),
		new NgnSelectOption({ name: "Hardpoint", value: "Hardpoint" }),
		new NgnSelectOption({ name: "Mod", value: "Mod" })
	];

	public cardRarityOptions: NgnSelectOption[] = [
		new NgnSelectOption({ name: "Common", value: "Common" }),
		new NgnSelectOption({ name: "Uncommon", value: "Uncommon" }),
		new NgnSelectOption({ name: "Rare", value: "Rare" }),
		new NgnSelectOption({ name: "Ultra Rare", value: "Ultra Rare" })
	];

	public cardDirectionOptions: NgnSelectOption[] = [
		new NgnSelectOption({ name: "Vertical", value: "Vertical" }),
		new NgnSelectOption({ name: "Horizontal", value: "Horizontal" }),
		new NgnSelectOption({ name: "Lateral", value: "Lateral" }),
		new NgnSelectOption({ name: "Diagonal", value: "Diagonal" }),
		new NgnSelectOption({ name: "Any", value: "Any" })
	];

	public cardAreaOfEffectOptions: NgnSelectOption[] = [
		new NgnSelectOption({ name: "Single", value: "Single" }),
		new NgnSelectOption({ name: "Plus", value: "Plus" }),
		new NgnSelectOption({ name: "Diagonal", value: "Diagonal" }),
		new NgnSelectOption({ name: "Radial", value: "Radial" }),
		new NgnSelectOption({ name: "Cone", value: "Cone" })
	];

	public abilityKeywords: string[] = [
		"Sustain",
		"Shimmer",
		"Shield",
		"Dwindle",
		"Sacrifice",
		"Counter",
		"Scrap",
		"Scavenge",
		"Backup"
	];

	public cardSearchQPs = {};

	constructor(
		private httpClient: HttpClient,
		private api: Api,
		private alertService: AlertService
	) {
		this.showPageLoader();
	}

	public shouldShowPageLoader() {
		return this.showPageLoader$;
	}

	public showPageLoader() {
		this.showPageLoader$.next(true);
	}

	public hidePageLoader() {
		this.showPageLoader$.next(false);
	}

	public shouldShowProcessingLoader() {
		return this.showProcessingLoader$;
	}

	public showProcessingLoader(text?: string) {
		this.processingText = text ?? this.defaultProcessingText;
		this.showProcessingLoader$.next(true);
	}

	public hideProcessingLoader() {
		this.processingText = this.defaultProcessingText;
		this.showProcessingLoader$.next(false);
	}

	public setProcessingText(text: string) {
		this.processingText = text;
	}

	public getProcessingText() {
		return this.processingText;
	}

	public getUserRoles() {
		return this.userRoles;
	}

	public setUserRoles(data: string[]) {
		this.userRoles = data;
	}

	public getAppSettings() {

	}

	public getApiUserRoles(id: string): Promise<any> {
		return new Promise((resolve) => {
			resolve([]);
		})
	}

	public findRecentCardVersions(card) {
		let versionHighlow = card?.cardVersions?.reduce((result, item) => {
			if (!result) {
				result = {
					lowest: item,
					previous: item,
					highest: item
				};
				return result;
			}

			if (item.version < result.lowest.version) {
				result.lowest = item;
			}

			if (item.version > result.highest.version) {
				result.highest = item;
			}

			if (item.version == result.highest.version - 1) {
				result.previous = item;
			}

			return result;
		}, null);

		return versionHighlow;
	}

	public parseAbilityText(text: string) {
		text = text.replace(/(leg)(?=[:'.,\s])/gm, "<img src='assets/images/icons/leg.png' alt='Leg' title='Leg' class='ability-icon'>");
		text = text.replace(/(arm)(?=[:'.,\s])/gm, "<img src='assets/images/icons/arm.png' alt='Arm' title='Arm' class='ability-icon'>");
		text = text.replace(/(head)(?=[:'.,\s])/gm, "<img src='assets/images/icons/head.png' alt='Head' title='Head' class='ability-icon'>");
		text = text.replace(/(hardpoint)(?=[:'.,\s])/gm, "<img src='assets/images/icons/hardpoint.png' alt='Hardpoint' title='Hardpoint' class='ability-icon'>");
		text = text.replace(/(mod)(?=[:'.,\s])/gm, "<img src='assets/images/icons/mod.png' alt='Mod' title='Mod' class='ability-icon'>");
		text = text.replace(/(core health)(?=[:'.,\s])/gm, "<img src='assets/images/icons/corehealth.png' alt='Core Health' title='Core Health' class='ability-icon'>");
		text = text.replace(/(core)(?=[:'.,\s])/gm, "<img src='assets/images/icons/core.png' alt='Core' title='Core' class='ability-icon'>");
		text = text.replace(/(armor)(?=[:'.,\s])/gm, "<img src='assets/images/icons/armor.png' alt='Armor' title='Armor' class='ability-icon'>");
		text = text.replace(/(agility)(?=[:'.,\s])/gm, "<img src='assets/images/icons/agility.png' alt='Agility' title='Agility' class='ability-icon'>");
		text = text.replace(/(energy)(?=[:'.,\s])/gm, "<img src='assets/images/icons/energy.png' alt='Energy' title='Energy' class='ability-icon'>");

		this.abilityKeywords.forEach((keyword) => {
			if (text.includes(keyword)) {
				text = text.replace(keyword, `<span class='ability-keyword'>${keyword}</span>`);
			}
		});

		return text;
	}
}
