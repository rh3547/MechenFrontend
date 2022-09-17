import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { NgnCoreModule } from '@ng-nuc/core';
import { NgnComponentsModule } from '@ng-nuc/components';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CardsRoutingModule } from './cards-routing.module';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { NgxMaskModule, IConfig } from 'ngx-mask';

// Shared Entities
import { SharedModule } from '@shared/shared.module';

// Pages
import { CardSearchPage } from './pages/card-search/card-search.page';
import { CardDetailsPage } from './pages/card-details/card-details.page';
import { CardCreatePage } from './pages/card-create/card-create.page';

// Components
import { CardViewerComponent } from './components/card-viewer/card-viewer.component';
import { CardPreviewComponent } from './components/card-preview/card-preview.component';

export const maskConfig: Partial<IConfig> = {
	dropSpecialCharacters: false
};

@NgModule({
	declarations: [
		CardSearchPage,
		CardDetailsPage,
		CardCreatePage,
		CardViewerComponent,
		CardPreviewComponent
	],
	imports: [
		SharedModule,
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		CardsRoutingModule,
		NgnCoreModule,
		NgnComponentsModule,
		NgbModule,
		NgxSmartModalModule.forChild(),
		NgxMaskModule.forRoot(maskConfig)
	],
	entryComponents: [
		// CardViewerComponent
	],
	providers: [],
})
export class CardsModule { }
