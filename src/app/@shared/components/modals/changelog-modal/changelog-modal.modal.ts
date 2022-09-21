import { Component, OnInit, Input } from '@angular/core';
import { GlobalVars } from '@app/@core/services';
import { NgxSmartModalService, NgxSmartModalComponent } from 'ngx-smart-modal';

const defaultModalId = "generic-confirm";
const defaultTitle = "Confirm";
const defaultMessage = "Are you sure you want to continue?";
const defaultHeaderClass = "";
const defaultBodyClass = "";
const defaultMessageClass = "mb-md";
const defaultFooterClass = "flex-justify-end";
const defaultCancelBtnText = "Cancel";
const defaultCancelBtnClass = "theme-btn thin bg-medium-2 fg-white pl-xl pr-xl";
const defaultConfirmBtnText = "Confirm";
const defaultConfirmBtnClass = "theme-btn thin fg-white pl-xl pr-xl";
const defaultIconClass = "fas fa-question";
@Component({
	selector: 'changelog-modal-component',
	templateUrl: './changelog-modal.modal.html',
	styleUrls: ['./changelog-modal.modal.scss'],
})
export class ChangelogModal implements OnInit {

	private modal: NgxSmartModalComponent;

	@Input() modalId: string = defaultModalId;

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
