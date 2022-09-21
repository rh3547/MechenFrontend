import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { NgxNotificationMsgModule } from 'ngx-notification-msg';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { ConfirmModal } from '@components/modals/confirm-modal/confirm-modal.modal';
import { ChangelogModal } from '@components/modals/changelog-modal/changelog-modal.modal';
import { FooterComponent } from '@components/footer/footer.component';
import { PageHeaderComponent } from '@components/pageheader/pageheader.component';
import { SidebarComponent } from '@components/sidebar/sidebar.component';
import { ToolbarComponent } from '@components/toolbar/toolbar.component';

import { PdfViewerModule } from 'ng2-pdf-viewer';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgnCoreModule } from '@ng-nuc/core';
import { NgnComponentsModule } from '@ng-nuc/components';

import { RoleCheckDirective } from './directives/role-check.directive';

@NgModule({
	declarations: [
		ConfirmModal,
		ChangelogModal,
		FooterComponent,
		PageHeaderComponent,
		SidebarComponent,
		ToolbarComponent,
		RoleCheckDirective
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		HttpClientModule,
		NgxNotificationMsgModule,
		RouterModule,
		PdfViewerModule,
		NgbModule,
		NgnCoreModule,
		NgnComponentsModule
	],
	exports: [
		FooterComponent,
		ConfirmModal,
		ChangelogModal,
		PageHeaderComponent,
		SidebarComponent,
		ToolbarComponent,
		RoleCheckDirective
	],
	providers: []
})
export class SharedModule { }
