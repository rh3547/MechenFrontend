export enum ToolbarItemTypes {
	Button = "button",
	Separator = "separator"
}

export class ToolbarButton {
	key: string;
	text: string;
	buttonClass: string;
	iconClass: string;
	link: any[];
	type: string = ToolbarItemTypes.Button;

	constructor(obj?) {
		this.key = obj && obj.key || "";
		this.text = obj && obj.text || "";
		this.buttonClass = obj && obj.buttonClass || "";
		this.iconClass = obj && obj.iconClass || "";
		this.link = obj && obj.link || undefined;
	}
}

export class ToolbarSeparator extends ToolbarButton {
	type: string = ToolbarItemTypes.Separator;
}
