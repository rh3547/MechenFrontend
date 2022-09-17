import { Component, OnInit, Input } from '@angular/core';
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
	selector: 'confirm-modal-component',
	templateUrl: './confirm-modal.modal.html',
	styleUrls: ['./confirm-modal.modal.scss'],
})
export class ConfirmModal implements OnInit {

	private modal: NgxSmartModalComponent;

	@Input() modalId: string = defaultModalId;
	@Input() title: string = defaultTitle;
	@Input() message: string = defaultMessage;
	@Input() headerClass: string = defaultHeaderClass;
	@Input() bodyClass: string = defaultBodyClass;
	@Input() messageClass: string = defaultMessageClass;
	@Input() footerClass: string = defaultFooterClass;
	@Input() cancelBtnText: string = defaultCancelBtnText;
	@Input() cancelBtnClass: string = defaultCancelBtnClass;
	@Input() confirmBtnText: string = defaultConfirmBtnText;
	@Input() confirmBtnClass: string = defaultConfirmBtnClass;
	@Input() iconClass: string = defaultIconClass;

	constructor(
		private modalService: NgxSmartModalService
	) {
		this.modal = this.modalService.getTopOpenedModal();

		if (this.modal.hasData()) {
			var data = this.modal.getData();

			this.modalId = data.modalId || defaultModalId;
			this.title = data.title || defaultTitle;
			this.message = data.message || defaultMessage;
			this.headerClass = data.headerClass || defaultHeaderClass;
			this.bodyClass = data.bodyClass || defaultBodyClass;
			this.messageClass = data.messageClass || defaultMessageClass;
			this.footerClass = data.footerClass || defaultFooterClass;
			this.cancelBtnText = data.cancelBtnText || defaultCancelBtnText;
			this.cancelBtnClass = data.cancelBtnClass || defaultCancelBtnClass;
			this.confirmBtnText = data.confirmBtnText || defaultConfirmBtnText;
			this.confirmBtnClass = data.confirmBtnClass || defaultConfirmBtnClass;
			this.iconClass = data.iconClass || null;
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
