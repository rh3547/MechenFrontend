import { ViewportScroller } from '@angular/common';
import { Injectable } from '@angular/core';
import * as $ from "jquery";

@Injectable({
	providedIn: 'root'
})
export class NavService {

	public activeNav: string = "home";

	constructor(
		private scroller: ViewportScroller
	) { }

	public scrollTo(elementId: string) {
		this.scroller.scrollToAnchor(elementId);
	}

	public isScrolledIntoView(elementId: string) {
		let docViewTop = $(window).scrollTop();
		let docViewBottom = docViewTop + $(window).height();

		let elementTop = $(`#${elementId}`).offset().top;
		let elementBottom = elementTop + $(`#${elementId}`).height();

		return elementTop <= (docViewTop + 100);
	}
}
