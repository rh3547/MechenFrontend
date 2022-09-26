import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { NgnCoreModule } from '@ng-nuc/core';
import { NgnComponentsModule } from '@ng-nuc/components';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DecksRoutingModule } from './decks-routing.module';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { NgxMaskModule, IConfig } from 'ngx-mask';

// Shared Entities
import { SharedModule } from '@shared/shared.module';

// Pages
import { DeckSearchPage } from './pages/deck-search/deck-search.page';
import { DeckCreatePage } from './pages/deck-create/deck-create.page';
import { DeckViewPage } from './pages/deck-view/deck-view.page';

// Components

export const maskConfig: Partial<IConfig> = {
	dropSpecialCharacters: false
};

@NgModule({
	declarations: [
		DeckSearchPage,
		DeckCreatePage,
		DeckViewPage
	],
	imports: [
		SharedModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		DecksRoutingModule,
		NgnCoreModule,
		NgnComponentsModule,
		NgbModule,
		NgxSmartModalModule.forChild(),
		NgxMaskModule.forRoot(maskConfig)
	],
	entryComponents: [],
	providers: [],
})
export class DecksModule { }
