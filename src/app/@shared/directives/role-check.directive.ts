import { Directive, Input, ElementRef, OnInit } from '@angular/core';
import { UserHelperService } from '@core/services/user-helper.service';

@Directive({
	selector: '[roleCheck]'
})
export class RoleCheckDirective {

	// ex: roleCheck: globalVars.allPolicy
	@Input('roleCheck') roleCheck: any = [];

	private element: ElementRef;

	constructor(ele: ElementRef, private userHelper: UserHelperService) {
		this.element = ele;
	}

	ngOnInit() {
		this.showHideElement();
	}

	showHideElement() {
		this.userHelper.userIsInRoles(this.roleCheck).then(
			(roleFound) => {
				if (!roleFound) {
					this.element.nativeElement.parentNode.removeChild(this.element.nativeElement);
				}
			},
			(err) => {
				console.error(err);
			}
		);
	}
}
