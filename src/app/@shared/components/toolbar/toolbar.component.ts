import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ToolbarButton, ToolbarItemTypes, ToolbarSeparator } from './toolbar.model';

@Component({
	selector: 'nuc-toolbar',
	templateUrl: './toolbar.component.html',
	styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {

	@Input("buttons") buttons: ToolbarButton[] = [];
	@Output("onClick") onClick = new EventEmitter();

	constructor(private router: Router) { }

	ngOnInit() { }

	functionFired(btn: ToolbarButton) {
		if (btn.link != undefined || btn.link != null) {
			this.router.navigate(btn.link);
		}
		else {
			this.onClick.emit(btn.key);
		}
	}

	isSeparator(btn: ToolbarButton) {
		return btn instanceof ToolbarSeparator;
	}

	shouldShowDivider(index: number) {
		let currentButton = this.buttons[index];
		let nextButton = this.buttons[index + 1]

		if (currentButton.type == ToolbarItemTypes.Separator) return false;
		if (nextButton && nextButton.type == ToolbarItemTypes.Separator) return false;
		return index < this.buttons.length - 1
	}
}
