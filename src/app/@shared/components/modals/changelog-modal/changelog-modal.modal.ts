import { Component, OnInit, Input } from '@angular/core';
import { GlobalVars } from '@app/@core/services';
import { NgnSelectOption } from '@ng-nuc/components';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';

const defaultModalId = "generic-confirm";

@Component({
	selector: 'changelog-modal-component',
	templateUrl: './changelog-modal.modal.html',
	styleUrls: ['./changelog-modal.modal.scss'],
})
export class ChangelogModal implements OnInit {

	private modal: NgxSmartModalComponent;

	@Input() modalId: string = defaultModalId;

	public version: string;
	public versionOptions: NgnSelectOption[] = [
		new NgnSelectOption({ name: "1.2.0", value: "1.2.0" }),
		new NgnSelectOption({ name: "1.3.0", value: "1.3.0" }),
		new NgnSelectOption({ name: "1.4.0", value: "1.4.0" }),
		new NgnSelectOption({ name: "1.5.0", value: "1.5.0" }),
		new NgnSelectOption({ name: "1.5.1", value: "1.5.1" }),
	];

	constructor(
		private modalService: NgxSmartModalService,
		public globalVars: GlobalVars
	) {
		this.modal = this.modalService.getTopOpenedModal();

		if (this.modal.hasData()) {
			var data = this.modal.getData();
			this.modalId = data.modalId || defaultModalId;
		}
	}

	ngOnInit() {
		this.version = `${this.globalVars.appVersion}`;
	}

	public cancel() {
		this.modal.setData({ closeType: "cancel" }, true);
		this.modalService.close(this.modalId);
	}

	public confirm() {
		this.modal.setData({ closeType: "confirm" }, true);
		this.modalService.close(this.modalId);
	}
}
